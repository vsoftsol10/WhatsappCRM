const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

const {
  getOrCreateConversation,
} = require("../helpers/conversationHelper");

const {
  saveIncomingMessage,
} = require("../helpers/messageHelper");

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