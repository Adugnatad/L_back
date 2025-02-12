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

/**
 * Get meetings.
 */
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
 * Delete meeting.
 */
export const deleteMeeting = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  try {
    const meeting = await prisma.meeting.delete({
      where: { id },
    });
    res.status(204).json({ success: true, meeting });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete meeting" });
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
        status: "pending",
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
 * get pull fund requests.
 */
export const getPullFundRequests = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const fundTransfers = await prisma.fundTransfer.findMany({
      where: { phone_number: req.decoded.phone_number },
    });
    res.status(200).json({ success: true, fundTransfers });
  } catch (error) {
    console.error("Error fetching fund transfers:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch fund transfers" });
  }
};

/**
 * Delete fund transfer request.
 */
export const deleteFundTransferRequest = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    const fundTransfer = await prisma.fundTransfer.delete({
      where: { id },
    });
    res.status(204).json({ success: true, fundTransfer });
  } catch (error) {
    console.error("Error deleting fund transfer:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete fund transfer" });
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

/**
 * get rating.
 */
export const getRatings = async (req: CustomRequest, res: Response) => {
  try {
    const performanceFeedbacks = await prisma.performanceFeedback.findMany({
      where: { phone_number: req.decoded.phone_number },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, performanceFeedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch feedbacks" });
  }
};
