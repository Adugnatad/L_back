import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
interface CustomRequest extends Request {
  decoded?: { phone_number: string };
}

/**
 * Schedule a meeting.
 */
export const setMeeting = async (req: CustomRequest, res: Response) => {
  const { date, time, purpose, type } = req.body;

  try {
    const meeting = await prisma.meeting.create({
      data: {
        date,
        time,
        purpose,
        type,
        phone_number: req.decoded.phone_number,
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

export const getMeetings = async (req: CustomRequest, res: Response) => {
  try {
    const meetings = await prisma.meeting.findMany({
      where: { phone_number: req.decoded.phone_number },
    });
    res.status(200).json({ success: true, meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch meetings" });
  }
};

/**
 * Pull funds from a source bank.
 */
export const pullFunds = async (req: CustomRequest, res: Response) => {
  const { sourceBank, amount, purpose } = req.body;

  try {
    const fundTransfer = await prisma.fundTransfer.create({
      data: {
        sourceBank,
        amount: parseFloat(amount),
        purpose,
        phone_number: req.decoded.phone_number,
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
export const giveRating = async (req: CustomRequest, res: Response) => {
  const { rating, feedback } = req.body;

  try {
    const performanceFeedback = await prisma.performanceFeedback.create({
      data: {
        rating,
        feedback,
        phone_number: req.decoded.phone_number,
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
