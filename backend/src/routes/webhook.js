const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");
const { getIO } = require("../config/socket");

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

router.post("/", async (req, res) => {
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
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
    
      await saveIncomingMessage(conversation.id, text);
        console.log("Message saved successfully");

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

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});



module.exports = router;