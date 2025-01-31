// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a sample loan with stages and messages
  const meeting = await prisma.meeting.create({
    data: {
      date: String(new Date()),
      time: "11:15 AM",
      purpose: "Financial Planning Session",
      type: "in_person",
      phone_number: "+251942177936",
    },
  });

  console.log("Seeded loan:", meeting);
}

main()
  .then(() => console.log("Seeding complete"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
