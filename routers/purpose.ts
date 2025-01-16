const express = require("express");
const router = express.Router();
import { getPurposes, createPurpose } from "../controllers/purpose";

router.get("/getPurposes", getPurposes);
router.post("/createPurpose", createPurpose);

export default router;
