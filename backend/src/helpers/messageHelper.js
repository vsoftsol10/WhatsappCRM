// // const prisma = require("../config/prisma");

// // const saveIncomingMessage = async (
// //   conversationId,
// //   text
// // ) => {
// //   try {
// //     console.log("========== SAVE MESSAGE ==========");
// //     console.log("Conversation ID:", conversationId);
// //     console.log("Message:", text);

// //     // Save incoming message
// //     const message = await prisma.message.create({
// //       data: {
// //         conversationId,
// //         content: text,
// //         sender: "CUSTOMER",
// //         messageType: "TEXT",
// //         status: "RECEIVED",
// //       },
// //     });

// //     // Update conversation
// //     await prisma.conversation.update({
// //       where: {
// //         id: conversationId,
// //       },
// //       data: {
// //         lastMessage: text,
// //         unreadCount: {
// //           increment: 1,
// //         },
// //       },
// //     });

// //     console.log("Message Saved Successfully");
// //     console.log(message);

// //     return message;
// //   } catch (error) {
// //     console.error("SAVE MESSAGE ERROR");
// //     console.error(error);

// //     throw error;
// //   }
// // };

// // module.exports = {
// //   saveIncomingMessage,
// // };

// const prisma = require("../config/prisma");
// const { sendTextMessage } = require("../services/whatsappService");

// const WELCOME_MESSAGE =
//   process.env.WHATSAPP_WELCOME_MESSAGE ||
//   `Hi,

//   We're pleased to welcome you to VsoftSolutions! Thank you for connecting with us.

//   This message confirms your successful engagement. Our team is dedicated to providing you with exceptional service and support.

//   Should you require any immediate assistance, please do not hesitate to contact us.

//   You can reach us via:
//   Phone: 9876546375
//   Email: vsoft@gmail.com

//   We look forward to assisting you.`;

// // Sends a one-time acknowledgement to a customer the first time they
// // message us on a conversation, and saves that outbound message so it
// // shows up in the chat thread like a normal agent reply.
// // Guarded by conversation.welcomeSent so returning customers don't get
// // "thanks for contacting us" on every single message.
// const sendWelcomeReplyIfNeeded = async (conversation) => {
//   if (!conversation || conversation.welcomeSent) {
//     return;
//   }

//   const recipientPhone = conversation.phone;

//   if (!recipientPhone) {
//     console.warn(
//       "Skipping auto-reply: conversation has no phone number",
//       conversation.id
//     );
//     return;
//   }

//   const result = await sendTextMessage(recipientPhone, WELCOME_MESSAGE);

//   if (!result.success) {
//     console.error(
//       "Auto-reply failed to send, will retry on next incoming message:",
//       result.error
//     );
//     return;
//   }

//   const metaMessageId = result.data?.messages?.[0]?.id || null;

//   await prisma.message.create({
//     data: {
//       conversationId: conversation.id,
//       content: WELCOME_MESSAGE,
//       sender: "AGENT",
//       messageType: "TEXT",
//       status: "SENT",
//       metaMessageId,
//     },
//   });

//   await prisma.conversation.update({
//     where: { id: conversation.id },
//     data: {
//       welcomeSent: true,
//       lastMessage: WELCOME_MESSAGE,
//     },
//   });

//   console.log("Auto-reply sent and saved for conversation:", conversation.id);
// };

// const saveIncomingMessage = async (
//   conversationId,
//   text
// ) => {
//   try {
//     console.log("========== SAVE MESSAGE ==========");
//     console.log("Conversation ID:", conversationId);
//     console.log("Message:", text);

//     // Save incoming message
//     const message = await prisma.message.create({
//       data: {
//         conversationId,
//         content: text,
//         sender: "CUSTOMER",
//         messageType: "TEXT",
//         status: "RECEIVED",
//       },
//     });

//     // Update conversation
//     await prisma.conversation.update({
//       where: {
//         id: conversationId,
//       },
//       data: {
//         lastMessage: text,
//         unreadCount: {
//           increment: 1,
//         },
//       },
//     });

//     console.log("Message Saved Successfully");
//     console.log(message);

//     return message;
//   } catch (error) {
//     console.error("SAVE MESSAGE ERROR");
//     console.error(error);

//     throw error;
//   }
// };

// module.exports = {
//   saveIncomingMessage,
//   sendWelcomeReplyIfNeeded,
// };

const prisma = require("../config/prisma");
const { sendTextMessage } = require("../services/whatsappService");

const WELCOME_MESSAGE =
  process.env.WHATSAPP_WELCOME_MESSAGE ||
  `Hi,

   We're pleased to welcome you to VsoftSolutions! Thank you for connecting with us.

   This message confirms your successful engagement. Our team is dedicated to providing you with exceptional service and support.

   Should you require any immediate assistance, please do not hesitate to contact us.

   You can reach us via:
   Phone: 9876546375
   Email: vsoft@gmail.com

   We look forward to assisting you.`;

// Sends a one-time acknowledgement to a customer the first time they
// message us on a conversation, and saves that outbound message so it
// shows up in the chat thread like a normal agent reply.
// Guarded by conversation.welcomeSent so returning customers don't get
// "thanks for contacting us" on every single message.
const sendWelcomeReplyIfNeeded = async (conversation) => {
  if (!conversation || conversation.welcomeSent) {
    return;
  }

  const recipientPhone = conversation.phone;

  if (!recipientPhone) {
    console.warn(
      "Skipping auto-reply: conversation has no phone number",
      conversation.id
    );
    return;
  }

  const result = await sendTextMessage(recipientPhone, WELCOME_MESSAGE);

  if (!result.success) {
    console.error(
      "Auto-reply failed to send, will retry on next incoming message:",
      result.error
    );
    return;
  }

  const metaMessageId = result.data?.messages?.[0]?.id || null;

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      content: WELCOME_MESSAGE,
      sender: "AGENT",
      messageType: "TEXT",
      status: "SENT",
      metaMessageId,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      welcomeSent: true,
      lastMessage: WELCOME_MESSAGE,
    },
  });

  console.log("Auto-reply sent and saved for conversation:", conversation.id);
};

const saveIncomingMessage = async (
  conversationId,
  text
) => {
  try {
    console.log("========== SAVE MESSAGE ==========");
    console.log("Conversation ID:", conversationId);
    console.log("Message:", text);

    // Save incoming message
    const message = await prisma.message.create({
      data: {
        conversationId,
        content: text,
        sender: "CUSTOMER",
        messageType: "TEXT",
        status: "RECEIVED",
      },
    });

    // Update conversation
    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessage: text,
        unreadCount: {
          increment: 1,
        },
      },
    });

    console.log("Message Saved Successfully");
    console.log(message);

    return message;
  } catch (error) {
    console.error("SAVE MESSAGE ERROR");
    console.error(error);

    throw error;
  }
};

// Sends any outbound bot/agent message and saves it to the DB so it
// shows up in the CRM conversation thread — used by the lead
// enrichment questions/confirmation (and reusable for future
// automated replies) instead of calling sendTextMessage raw.
const sendAndSaveOutgoingMessage = async (conversation, text) => {
  const result = await sendTextMessage(conversation.phone, text);

  if (!result.success) {
    console.error("Failed to send outgoing message:", result.error);
    return null;
  }

  const metaMessageId = result.data?.messages?.[0]?.id || null;

  const savedMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      content: text,
      sender: "AGENT",
      messageType: "TEXT",
      status: "SENT",
      metaMessageId,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessage: text },
  });

  return savedMessage;
};

module.exports = {
  saveIncomingMessage,
  sendWelcomeReplyIfNeeded,
  sendAndSaveOutgoingMessage,
};