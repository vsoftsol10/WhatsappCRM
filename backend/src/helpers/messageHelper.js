const prisma = require("../config/prisma");

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

module.exports = {
  saveIncomingMessage,
};