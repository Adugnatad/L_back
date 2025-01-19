const express = require("express");
import {
  getLoanDetail,
  getLoanStages,
  getLoanMessage,
  uploadFile,
  getLoans,
  getTotalLoanAmount,
  getTotalPendingRequests,
} from "../controllers/loan";

const router = express.Router();

router.get("/", getLoans);
router.get("/totalAmount", getTotalLoanAmount);
router.get("/totalPending", getTotalPendingRequests);
router.get("/:id", getLoanDetail);
router.get("/stages/:id", getLoanStages);
router.get("/message/:id", getLoanMessage);
router.post("/upload/:loanId", uploadFile);

export default router;
