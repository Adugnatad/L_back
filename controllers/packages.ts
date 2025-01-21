import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * Get loan packages with optional amount and term parameters.
 */
export const getPackages = async (req: Request, res: Response) => {
  const { amount, term } = req.params;

  try {
    // Fetch all packages
    const packages = await prisma.package.findMany();

    if (!amount || !term) {
      // If amount or term is not provided, return the packages without calculations
      return res.status(200).json(packages);
    }

    // Perform calculations if amount and term are provided
    const loanAmount = parseFloat(amount);
    const loanTerm = parseInt(term, 10);

    const pck = await prisma.package.findMany({
      where: { max: { gte: loanAmount } },
    });

    const result = pck.map((pkg) => {
      const monthlyRepayment =
        (pkg.apr * loanAmount) / 100 / 12 + loanAmount / loanTerm;
      const totalCharge = (pkg.apr * loanAmount) / 100;
      const totalRepayable = loanAmount + totalCharge;

      return {
        ...pkg,
        monthlyRepayment,
        totalCharge,
        totalRepayable,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
