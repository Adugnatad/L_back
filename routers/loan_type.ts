const express = require("express");
import { getLoanTypes, createLoanType } from "../controllers/loan_types";

const router = express.Router();

router.get("/getLoanType", getLoanTypes);
router.post("/createLoanType", createLoanType);

export default router;
