import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Fetch loan details
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

// Fetch loan stages
export const getLoanStages = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stages = await prisma.loanStage.findMany({
      where: { loanId: id },
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
