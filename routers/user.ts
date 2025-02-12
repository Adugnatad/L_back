const express = require("express");
const router = express.Router();
import { verifyToken } from "../config.ts/jwtToken";
import {
  signup,
  login,
  updatePersonalInformation,
  updatePassword,
  logout,
} from "../controllers/user";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.put("/personal-info", verifyToken, updatePersonalInformation);
router.post("/update-password", verifyToken, updatePassword);

export default router;
