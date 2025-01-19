const express = require("express");
const router = express.Router();
import {
  signup,
  login,
  updatePersonalInformation,
  updatePassword,
} from "../controllers/user";

router.post("/signup", signup);
router.post("/login", login);
router.put("/personal-info", updatePersonalInformation);
router.post("/update-password", updatePassword);

export default router;
