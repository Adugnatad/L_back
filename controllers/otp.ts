import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  decoded?: { phone_number: string };
}

const generateOtp = (length: number = 6): string => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

export const sendOtp = async (req: CustomRequest, res: Response) => {
  try {
    // Generate a random OTP
    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

    // Save OTP in the database
    await prisma.otp.create({
      data: {
        otp,
        userId: req.decoded.phone_number,
        expiresAt,
      },
    });

    // Simulate sending OTP (via SMS, email, etc.)
    console.log(`OTP for user ${req.decoded.phone_number}: ${otp}`); // Replace with actual send logic

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required" });
  }

  try {
    // Find OTP in the database
    const otpRecord = await prisma.otp.findFirst({
      where: { otp, verified: false },
    });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (otpRecord.expiresAt < currentTime) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // Mark OTP as verified
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
