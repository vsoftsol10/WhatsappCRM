// const prisma = require("../config/prisma");

// const getOrCreateConversation = async (phone) => {
//   // Find customer by phone
//   let customer = await prisma.customer.findUnique({
//     where: {
//       phone,
//     },
//   });

//   // Create customer if not exists
//   if (!customer) {
//     customer = await prisma.customer.create({
//       data: {
//         name: phone,
//         phone,
//         status: "ACTIVE",

//         userId: "1a8e73d5-fafc-4bd2-bf4a-c256e812bda9",
//       },
//     });
//   }

//   // Find conversation
//   let conversation = await prisma.conversation.findUnique({
//     where: {
//       phone,
//     },
//     include: {
//       customer: true,
//     },
//   });

//   // Create conversation if not exists
//   if (!conversation) {
//     conversation = await prisma.conversation.create({
//       data: {
//         phone,
//         customerId: customer.id,
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