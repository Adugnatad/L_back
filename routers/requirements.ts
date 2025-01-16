const express = require("express");
const router = express.Router();
import {
  getRequirements,
  createRequirement,
} from "../controllers/requirements";

router.get("/getRequirements", getRequirements);
router.post("/createRequirements", createRequirement);

export default router;
