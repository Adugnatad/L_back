import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * Schedule a meeting.
 */
export const setMeeting = async (req: Request, res: Response) => {
  const { date, time, purpose } = req.body;

  try {
    const meeting = await prisma.meeting.create({
      data: {
        date,
        time,
        purpose,
      },
    });
    res.status(201).json({ success: true, meeting });
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to schedule meeting" });
  }
};

/**
 * Pull funds from a source bank.
 */
export const pullFunds = async (req: Request, res: Response) => {
  const { sourceBank, amount, purpose } = req.body;

  try {
    const fundTransfer = await prisma.fundTransfer.create({
      data: {
        sourceBank,
        amount: parseFloat(amount),
        purpose,
      },
    });
    res.status(201).json({ success: true, fundTransfer });
  } catch (error) {
    console.error("Error pulling funds:", error);
    res.status(500).json({ success: false, message: "Failed to pull funds" });
  }
};

/**
 * Provide feedback for RM performance.
 */
export const giveRating = async (req: Request, res: Response) => {
  const { rating, feedback } = req.body;

  try {
    const performanceFeedback = await prisma.performanceFeedback.create({
      data: {
        rating,
        feedback,
      },
    });
    res.status(201).json({ success: true, performanceFeedback });
  } catch (error) {
    console.error("Error giving feedback:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to give feedback" });
  }
};
