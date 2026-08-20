const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const prisma = require("../config/prisma");
const { getIO } = require("../config/socket");

// Verifies that a POST to this webhook was actually signed by Meta
// with our app secret, not just guessed by someone who found the
// URL. Meta signs the raw request body and sends the signature in
// X-Hub-Signature-256. If META_APP_SECRET isn't configured we log a
// warning and let requests through, so local development without the
// secret set still works — but this should always be set in
// production.
const verifyWebhookSignature = (req, res, next) => {
  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret) {
    console.warn(
      "META_APP_SECRET not set — webhook signature is NOT being verified. Set this in production."
    );
    return next();
  }

  const signatureHeader = req.headers["x-hub-signature-256"];

  if (!signatureHeader || !req.rawBody) {
    return res.sendStatus(401);
  }

  const expectedSignature =
    "sha256=" +
    crypto
      .createHmac("sha256", appSecret)
      .update(req.rawBody)
      .digest("hex");

  const receivedBuffer = Buffer.from(signatureHeader);
  const expectedBuffer = Buffer.from(expectedSignature);

  const isValid =
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

  if (!isValid) {
    console.warn("Webhook signature verification failed");
    return res.sendStatus(401);
  }

  next();
};

const {
  getOrCreateConversation,
} = require("../helpers/conversationHelper");

const {
  saveIncomingMessage,
  sendWelcomeReplyIfNeeded,
} = require("../helpers/messageHelper");

const {
  classifyCustomerMessage,
} = require("../services/geminiService");

const {
  createLeadFromClassification,
} = require("../helpers/leadHelper");

const {
  startLeadEnrichment,
  handlePendingLeadAnswer,
} = require("../helpers/leadEnrichmentHelper");

const {
  startTicketEnrichment,
  handlePendingTicketAnswer,
} = require("../helpers/ticketEnrichmentHelper");

const { notifyAdmins, NotificationType } = require("../services/notificationService");

router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {
    console.log("Webhook Verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Meta expects a fast 2xx ack for every webhook delivery — if we take
// too long (Gemini call, WhatsApp send, cold start, etc.) it assumes
// the delivery failed and retries with the SAME message, which our
// duplicate-guard then has to swallow. So the route handler below
// acks immediately after signature verification, and this function
// does the actual save/reply/classify/lead work in the background,
// completely decoupled from the HTTP response.
const processWebhookPayload = async (value) => {
  try {
    const message = value?.messages?.[0];
    const statuses = value?.statuses;

    if (message) {
      const phone = message.from;

      // Fall back for non-text messages (image/sticker/voice/location/
      // button or interactive replies) so the incoming message still
      // gets saved instead of throwing on a required "content" field.
      const text =
        message.text?.body ||
        message.button?.text ||
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        `[${message.type || "unsupported"} message]`;

      console.log("Phone :", phone);
      console.log("Message :", text);

      const conversation = await getOrCreateConversation(phone);

      console.log("Conversation ID :",conversation.id);
      if (conversation.customer) {
        console.log("Customer :", conversation.customer.name);
        } else {
        console.log("Customer : Not linked yet");
        }

      // Meta retries webhook deliveries it thinks were slow to
      // acknowledge. message.id is WhatsApp's own id for this
      // message — storing it and catching the resulting unique-
      // constraint error lets us detect and skip a duplicate
      // delivery instead of fully reprocessing (double AI
      // classification, double lead/ticket, double reply).
      try {
        await saveIncomingMessage(conversation.id, text, message.id || null);
        console.log("Message saved successfully");
      } catch (saveError) {
        if (saveError.code === "P2002") {
          console.log("Duplicate webhook delivery detected, skipping:", message.id);
          return;
        }
        throw saveError;
      }

      // Step 3: auto-reply. Only fires once per conversation (guarded by
      // welcomeSent) so we don't spam "thanks for contacting us" on every
      // message a customer sends.
      try {
        await sendWelcomeReplyIfNeeded(conversation);
      } catch (autoReplyError) {
        console.error("Auto-reply error:", autoReplyError);
      }

      // Step 6a: if we're mid-conversation collecting company/email for
      // an enriched lead, OR mid-conversation collecting a name for a
      // ticket, this message is the customer's answer — not a new topic.
      // Handle it and skip classification entirely.
      let skipClassification = false;
      if (conversation.pendingLeadStep) {
        skipClassification = true;
        try {
          await handlePendingLeadAnswer(conversation, text);
        } catch (enrichmentError) {
          console.error("Lead enrichment answer error:", enrichmentError);
        }
      } else if (conversation.pendingTicketStep) {
        skipClassification = true;
        try {
          await handlePendingTicketAnswer(conversation, text);
        } catch (enrichmentError) {
          console.error("Ticket enrichment answer error:", enrichmentError);
        }
      }

      // Step 4: AI analysis. Classifies the message text into a product
      // + intent so Step 5 (Product Router) can decide where it goes.
      if (!skipClassification) {
      let classification = null;
      try {
        classification = await classifyCustomerMessage(text);
        console.log("AI Classification:", classification);
      } catch (classificationError) {
        console.error("AI classification error:", classificationError);
      }

      // Gemini was down/overloaded for every retry — don't let this
      // message quietly disappear as if it were "hi" with nothing to
      // say. Alert admins so a human can check the conversation and
      // create the lead/ticket manually if it turns out to be a real
      // enquiry.
      if (classification?.aiUnavailable) {
        try {
          await notifyAdmins({
            title: "AI classification unavailable",
            message: `Gemini was unreachable for a WhatsApp message from ${phone}: "${text}". Please review this conversation manually.`,
            type: NotificationType.SYSTEM,
          });
        } catch (notifyError) {
          console.error("Failed to notify admins of AI outage:", notifyError);
        }
      }

      // Step 5: Product Router. INQUIRY-intent messages become sales
      // Leads (existing flow, unchanged). SUPPORT-intent messages
      // become Tickets instead — this is what stops "I have a problem
      // in the ERP software" from being misfiled as an ERP sales lead.
      if (classification) {
        if (classification.intent === "SUPPORT") {
          try {
            await startTicketEnrichment(conversation, classification, text);
          } catch (ticketError) {
            console.error("Ticket creation error:", ticketError);
          }
        } else {
          try {
            const { lead, isNew } = await createLeadFromClassification(
              conversation,
              classification,
              text
            );

            // Step 6b: only kick off enrichment/forwarding the first time
            // this lead is created — not on every follow-up message about
            // the same product.
            if (isNew && lead) {
              await startLeadEnrichment(conversation, classification.product, lead);
            }
          } catch (leadError) {
            console.error("Lead creation error:", leadError);
          }
        }
      }
      }
    }

    // Delivery status updates (sent/delivered/read/failed) for messages
    // we sent out. Matched back to our Message row via metaMessageId so
    // failures are visible instead of silently disappearing.
    if (statuses && statuses.length > 0) {
      for (const statusEvent of statuses) {
        const metaMessageId = statusEvent.id;
        const newStatus = statusEvent.status; // sent | delivered | read | failed
        const failureReason =
          statusEvent.errors?.[0]?.title ||
          statusEvent.errors?.[0]?.message ||
          null;

        console.log("Status update:", metaMessageId, newStatus, failureReason || "");

        if (!metaMessageId) continue;

        try {
          await prisma.message.updateMany({
            where: { metaMessageId },
            data: {
              status: newStatus ? newStatus.toUpperCase() : undefined,
              failureReason,
            },
          });

          try {
            getIO().to("agents").emit("message:status", {
              metaMessageId,
              status: newStatus ? newStatus.toUpperCase() : undefined,
              failureReason,
            });
          } catch (socketError) {
            console.error("Socket broadcast failed:", socketError.message);
          }
        } catch (err) {
          console.error("Failed to update message status:", err);
        }
      }
    }

  } catch (error) {
    console.error("Webhook background processing error:", error);
  }
};

router.post("/", verifyWebhookSignature, (req, res) => {
  // Ack Meta immediately — signature is already verified by the
  // middleware above, so it's safe to accept the delivery now and do
  // the real work afterward. Meta only cares that we returned 2xx
  // quickly; it doesn't wait for or care about what happens next.
  res.sendStatus(200);

  const value = req.body.entry?.[0]?.changes?.[0]?.value;

  processWebhookPayload(value).catch((error) => {
    console.error("Unhandled webhook processing error:", error);
  });
});

module.exports = router;