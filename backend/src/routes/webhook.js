// const express = require("express");
// const router = express.Router();

// const {
//   getOrCreateConversation,
// } = require("../helpers/conversationHelper");

// const {
//   saveIncomingMessage,
// } = require("../helpers/messageHelper");

// router.get("/", (req, res) => {
//   const mode = req.query["hub.mode"];
//   const token = req.query["hub.verify_token"];
//   const challenge = req.query["hub.challenge"];

//   if (
//     mode === "subscribe" &&
//     token === process.env.VERIFY_TOKEN
//   ) {
//     console.log("Webhook Verified");
//     return res.status(200).send(challenge);
//   }

//   return res.sendStatus(403);
// });

// router.post("/", async (req, res) => {
//   try {
//     const value = req.body.entry?.[0]?.changes?.[0]?.value;
//     const message = value?.messages?.[0];

//     if (message) {
//       const phone = message.from;
//       const text = message.text?.body;

//       console.log("Phone :", phone);
//       console.log("Message :", text);

//       const conversation = await getOrCreateConversation(phone);

//       console.log("Conversation ID :",conversation.id);
//       if (conversation.customer) {
//         console.log("Customer :", conversation.customer.name);
//         } else {
//         console.log("Customer : Not linked yet");
//         }
    
//       await saveIncomingMessage(conversation.id, text);
//         console.log("Message saved successfully");
//     }

//     return res.sendStatus(200);
//   } catch (error) {
//     console.error(error);
//     return res.sendStatus(500);
//   }
// });



// module.exports = router;


const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");
const { sendTextMessage } = require("../services/whatsappService");
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

      // Find active welcome template
const welcomeTemplate = await prisma.template.findFirst({
  where: {
    purpose: "WELCOME",
    autoSend: true,
    status: "ACTIVE",
  },
});

if (welcomeTemplate) {

  // Check whether welcome already sent
  const alreadySent = await prisma.message.findFirst({
    where: {
      conversationId: conversation.id,
      sender: "ADMIN",
      content: welcomeTemplate.content,
    },
  });

  if (!alreadySent) {

    console.log("Sending Welcome Template");

    const result = await sendTextMessage(
      phone,
      welcomeTemplate.content
    );

    console.log(result);

    if (result.success) {

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          sender: "ADMIN",
          content: welcomeTemplate.content,
          messageType: "TEXT",
          status: "SENT",
        },
      });

      await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          lastMessage: welcomeTemplate.content,
        },
      });

      console.log("Welcome Template Sent");
    }
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