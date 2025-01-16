import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Fetch all purposes
export const getPurposes = async (req: Request, res: Response) => {
  try {
    const purposes = await prisma.purpose.findMany();
    res.status(200).json(purposes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch purposes" });
  }
};

// Add a new purpose
export const createPurpose = async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const purpose = await prisma.purpose.create({
      data: { title },
    });
    res.status(201).json(purpose);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(400).json({ error: "Duplicate ID, purpose already exists" });
      } else {
        res
          .status(400)
          .json({ error: "Database error", details: error.message });
      }
    } else {
      res.status(500).json({ error: "Failed to create purpose" });
    }
  }
};
