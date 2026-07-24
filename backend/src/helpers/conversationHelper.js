const prisma = require("../config/prisma");

const getOrCreateConversation = async (phone) => {
  let conversation = await prisma.conversation.findUnique({
    where: {
      phone,
    },
    include: {
      customer: true,
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        phone,
        status: "OPEN",
        channel: "WHATSAPP",
        unreadCount: 0,
      },
      include: {
        customer: true,
      },
    });
  }

  return conversation;
};

module.exports = {
  getOrCreateConversation,
};