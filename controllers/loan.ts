import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Fetch loan details

export const getLoans = async (req: Request, res: Response) => {
  try {
    const loans = await prisma.loan.findMany();
    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ error: "Failed to fetch loans" });
  }
};

export const getLoanDetail = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const loan = await prisma.loan.findUnique({
      where: { id },
      include: { stages: true, messages: true },
    });
    if (!loan) return res.status(404).json({ error: "Loan not found" });
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loan details" });
  }
};

export const getTotalLoanAmount = async (req: Request, res: Response) => {
  try {
    const totalAmount = await prisma.loan.aggregate({
      _sum: { amount: true },
    });

    res.status(200).json({ totalAmount: totalAmount._sum.amount || 0 });
  } catch (error) {
    console.error("Error fetching total loan amount:", error);
    res.status(500).json({ error: "Failed to fetch total loan amount" });
  }
};

export const getTotalPendingRequests = async (req: Request, res: Response) => {
  try {
    const totalPending = await prisma.loan.count({
      where: { status: { in: ["Pending Approval", "Under Review"] } }, // Adjust status filter based on your schema
    });

    res.status(200).json({ totalPending });
  } catch (error) {
    console.error("Error fetching total pending requests:", error);
    res.status(500).json({ error: "Failed to fetch total pending requests" });
  }
};

// Fetch loan stages
export const getLoanStages = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stages = await prisma.loanStage.findMany({
      where: { loanId: id },
      orderBy: { id: "asc" },
    });
    res.status(200).json(stages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loan stages" });
  }
};

// Fetch loan messages
export const getLoanMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const messages = await prisma.loanMessage.findMany({
      where: { loanId: id },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loan messages" });
  }
};

// Upload a file (mock implementation)
export const uploadFile = async (req: Request, res: Response) => {
  const { loanId } = req.params;
  //   const file = req.file;
  let file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Mock file storage
  try {
    // Here, you would handle file upload logic
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
};
