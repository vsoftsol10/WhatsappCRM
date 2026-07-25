// const prisma = require("../config/prisma");

// const getOrCreateConversation = async (phone) => {
//   // Find conversation by phone
//   let conversation = await prisma.conversation.findUnique({
//     where: {
//       phone,
//     },
//     include: {
//       customer: true,
//     },
//   });

//   if (conversation) {
//     return conversation;
//   }

//   // Find customer by phone
//   const customer = await prisma.customer.findUnique({
//     where: {
//       phone,
//     },
//   });

//   // Create conversation
//   conversation = await prisma.conversation.create({
//     data: {
//       phone: customer ? customer.phone : phone,
//       customerId: customer ? customer.id : null,
//       status: "OPEN",
//       channel: "WHATSAPP",
//       unreadCount: 0,
//     },
//     include: {
//       customer: true,
//     },
//   });

//   return conversation;
// };

// module.exports = {
//   getOrCreateConversation,
// };


const prisma = require("../config/prisma");

const getOrCreateConversation = async (phone) => {
  // 1. Try find conversation by phone
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

  // 2. Find customer by phone
  const customer = await prisma.customer.findUnique({
    where: {
      phone,
    },
  });

  // 3. If customer exists, check if a conversation already exists for them
  //    (covers cases where phone field mismatch happened, e.g. formatting)
  if (customer) {
    conversation = await prisma.conversation.findUnique({
      where: {
        customerId: customer.id,
      },
      include: {
        customer: true,
      },
    });

    if (conversation) {
      // Backfill the phone field so future lookups work directly
      if (!conversation.phone) {
        conversation = await prisma.conversation.update({
          where: { id: conversation.id },
          data: { phone },
          include: { customer: true },
        });
      }
      return conversation;
    }
  }

  // 4. Nothing found — safe to create a new conversation
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