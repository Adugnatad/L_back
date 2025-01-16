const express = require("express");
import {
  getLoanDetail,
  getLoanStages,
  getLoanMessage,
  uploadFile,
} from "../controllers/loan";

const router = express.Router();

router.get("/:id", getLoanDetail);
router.get("/stages/:id", getLoanStages);
router.get("/message/:id", getLoanMessage);
router.post("/upload/:loanId", uploadFile);

export default router;
