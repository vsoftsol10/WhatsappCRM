const express = require("express");
const router = express.Router();

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

    if (message) {
      const phone = message.from;
      const text = message.text?.body;

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

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

module.exports = router;