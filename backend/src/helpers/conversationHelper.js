// const prisma = require("../config/prisma");

// const getOrCreateConversation = async (phone) => {
//   let conversation = await prisma.conversation.findUnique({
//     where: {
//       phone,
//     },
//     include: {
//       customer: true,
//     },
//   });

//   if (!conversation) {
//     conversation = await prisma.conversation.create({
//       data: {
//         phone,
//         status: "OPEN",
//         channel: "WHATSAPP",
//         unreadCount: 0,
//       },
//       include: {
//         customer: true,
//       },
//     });
//   }

//   return conversation;
// };

// module.exports = {
//   getOrCreateConversation,
// };

const prisma = require("../config/prisma");

const getOrCreateConversation = async (phone) => {
  // Find conversation by phone
  let conversation = await prisma.conversation.findUnique({
    where: {
      phone,
    },
    include: {
      customer: true,
    },
  });

  if (conversation) {
    return conversation;
  }

  // Find customer by phone
  const customer = await prisma.customer.findUnique({
    where: {
      phone,
    },
  });

  // Create conversation
  conversation = await prisma.conversation.create({
    data: {
      phone: customer ? customer.phone : phone,
      customerId: customer ? customer.id : null,
      status: "OPEN",
      channel: "WHATSAPP",
      unreadCount: 0,
    },
    include: {
      customer: true,
    },
  });

  return conversation;
};

module.exports = {
  getOrCreateConversation,
};
