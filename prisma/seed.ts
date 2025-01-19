import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.meeting.createMany({
    data: [
      { date: "2024-12-25", time: "14:30", purpose: "Discuss new project" },
      {
        date: "2024-12-26",
        time: "10:00",
        purpose: "Review quarterly results",
      },
    ],
  });

  await prisma.fundTransfer.createMany({
    data: [
      { sourceBank: "Bank A", amount: 5000, purpose: "Project Funding" },
      { sourceBank: "Bank B", amount: 10000, purpose: "Salary Payments" },
    ],
  });

  await prisma.performanceFeedback.createMany({
    data: [
      { rating: 5, feedback: "Excellent service and support!" },
      { rating: 4, feedback: "Good experience, but room for improvement." },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding successful!");
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error("Seeding error:", error);
    prisma.$disconnect();
  });
