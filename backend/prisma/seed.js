const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");
  
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@crm.com" },
    update: {
      name: "System Admin",
      password: adminPassword,
      role: "ADMIN",
    },
    create: {
      email: "admin@crm.com",
      name: "System Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: "user@crm.com" },
    update: {
      name: "Standard User",
      password: userPassword,
      role: "USER",
    },
    create: {
      email: "user@crm.com",
      name: "Standard User",
      password: userPassword,
      role: "USER",
    },
  });
  
  console.log("Seeding finished successfully:");
  console.log(" - Admin:", admin.email);
  console.log(" - User:", normalUser.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
