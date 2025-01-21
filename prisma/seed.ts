// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a sample loan with stages and messages
  const loan = await prisma.loan.create({
    data: {
      type: "Home Loan",
      amount: 5000,
      status: "Pending Approval",
      date: new Date(),
      applicant: "Jane Doe",
      purpose: "Home Improvement",
      interestRate: 3.5,
      term: 180,
      stages: {
        create: [
          { name: "Application Submitted", status: "completed" },
          { name: "Approval Pending", status: "in-progress" },
        ],
      },
      messages: {
        create: [{ message: "Application received", date: new Date() }],
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
