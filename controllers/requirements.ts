import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  decoded?: string | object;
}

// Fetch all requirements
export const getRequirements = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.decoded);
    const requirements = await prisma.requirement.findMany();
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requirements" });
  }
};

// Add a new requirement
export const createRequirement = async (req: Request, res: Response) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const requirement = await prisma.requirement.create({
      data: { description },
    });
    res.status(201).json(requirement);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: "Database error", details: error.message });
    } else {
      res.status(500).json({ error: "Failed to create requirement" });
    }
  }
};
