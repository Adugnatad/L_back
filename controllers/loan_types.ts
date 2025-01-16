import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Fetch all loan types
export const getLoanTypes = async (req: Request, res: Response) => {
  try {
    const loanTypes = await prisma.loanType.findMany();
    res.status(200).json(loanTypes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loan types" });
  }
};

// Add a new loan type
export const createLoanType = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    const loanType = await prisma.loanType.create({
      data: { name, description },
    });
    res.status(201).json(loanType);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: "Database error", details: error.message });
    } else {
      res.status(500).json({ error: "Failed to create loan type" });
    }
  }
};
