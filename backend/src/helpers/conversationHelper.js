// const prisma = require("../config/prisma");

// const getOrCreateConversation = async (phone) => {
//   // 1. Try find conversation by phone
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

//   // 2. Find customer by phone
//   const customer = await prisma.customer.findUnique({
//     where: {
//       phone,
//     },
//   });

//   // 3. If customer exists, check if a conversation already exists for them
//   //    (covers cases where phone field mismatch happened, e.g. formatting)
//   if (customer) {
//     conversation = await prisma.conversation.findUnique({
//       where: {
//         customerId: customer.id,
//       },
//       include: {
//         customer: true,
//       },
//     });

//     if (conversation) {
//       // Backfill the phone field so future lookups work directly
//       if (!conversation.phone) {
//         conversation = await prisma.conversation.update({
//           where: { id: conversation.id },
//           data: { phone },
//           include: { customer: true },
//         });
//       }
//       return conversation;
//     }
//   }

//   // 4. Nothing found — safe to create a new conversation
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

  // 4. Nothing found — safe to create a new conversation.
  // Two webhook deliveries for the same brand-new phone number
  // arriving at (almost) the same instant could both reach this point
  // having found nothing, and both try to create — phone is a unique
  // column, so the loser of that race gets a P2002 error instead of
  // crashing the whole webhook handler. Catch it and just re-fetch
  // the row the winner created.
  try {
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
  } catch (error) {
    if (error.code === "P2002") {
      const winnerConversation = await prisma.conversation.findUnique({
        where: { phone: customer ? customer.phone : phone },
        include: { customer: true },
      });

      if (winnerConversation) {
        return winnerConversation;
      }
    }

    throw error;
  }
};

module.exports = {
  getOrCreateConversation,
};