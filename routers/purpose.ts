const express = require("express");
const router = express.Router();
import { verifyToken } from "../config.ts/jwtToken";
import { getPurposes, createPurpose } from "../controllers/purpose";

router.get("/getPurposes", verifyToken, getPurposes);
router.post("/createPurpose", createPurpose);

export default router;
