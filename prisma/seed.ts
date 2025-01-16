// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a sample loan with stages and messages
  const loan = await prisma.loan.create({
    data: {
      type: "CAR LOAN",
      amount: 15000,
      status: "active",
      date: new Date(),
      applicant: "John Doe",
      purpose: "Buying a car",
      interestRate: 5.5,
      term: 36,
      stages: {
        create: [
          { name: "Application Submitted", status: "completed" },
          { name: "Approval Pending", status: "in-progress" },
        ],
      },
      messages: {
        create: [
          { message: "Application received", date: new Date() },
          { message: "Waiting for approval", date: new Date() },
        ],
      },
    },
  });

  console.log("Seeded loan:", loan);
}

main()
  .then(() => console.log("Seeding complete"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
