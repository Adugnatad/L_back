// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a sample loan with stages and messages
  // const fund = await prisma.fundTransfer.create({
  // });
  // console.log("Seeded:", fund);
}

main()
  .then(() => console.log("Seeding complete"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
