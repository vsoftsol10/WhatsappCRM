// const prisma = require("../config/prisma");

// const saveIncomingMessage = async (conversationId, text) => {
//   console.log("Saving Message...");
//   console.log("Conversation ID:", conversationId);
//   console.log("Text:", text);
//   const message = await prisma.message.create({
//     data: {
//       conversationId,
//       content: text,
//       sender: "CUSTOMER",
//       messageType: "TEXT",
//       status: "RECEIVED",
//     },
//   });
//   console.log("Saved Message:", message);

//   return message;
// };

// module.exports = {
//   saveIncomingMessage,
// };

const prisma = require("../config/prisma");

const saveIncomingMessage = async (
  conversationId,
  text
) => {
  try {
    console.log("========== SAVE MESSAGE ==========");
    console.log("Conversation ID:", conversationId);
    console.log("Message:", text);

    const message = await prisma.message.create({
      data: {
        conversationId,
        content: text,
        sender: "CUSTOMER",
        messageType: "TEXT",
        status: "RECEIVED",
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

module.exports = {
  saveIncomingMessage,
};