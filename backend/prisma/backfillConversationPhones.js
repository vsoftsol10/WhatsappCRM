const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const backfillConversationPhones = async () => {
  const conversations = await prisma.conversation.findMany({
    where: {
      phone: null,
      customerId: {
        not: null,
      },
    },
    include: {
      customer: true,
    },
  });

  for (const conversation of conversations) {
    if (!conversation.customer?.phone) {
      continue;
    }

    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        phone: conversation.customer.phone,
      },
    });
  }

  console.log(
    `Backfilled ${conversations.length} conversation phone value(s).`
  );
};

backfillConversationPhones()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
