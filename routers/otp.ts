const express = require("express");
import { verifyToken } from "../config.ts/jwtToken";
import { sendOtp, verifyOtp } from "../controllers/otp";

const router = express.Router();

router.post("/send-otp", verifyToken, sendOtp);
router.post("/verify-otp", verifyToken, verifyOtp);

export default router;
