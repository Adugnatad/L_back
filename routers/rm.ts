const express = require("express");
import { verifyToken } from "../config.ts/jwtToken";
import {
  setMeeting,
  pullFunds,
  giveRating,
  getMeetings,
} from "../controllers/rm";

const router = express.Router();

router.post("/meeting", verifyToken, setMeeting);
router.post("/funds", verifyToken, pullFunds);
router.post("/rating", verifyToken, giveRating);

router.get("/get_meetings", verifyToken, getMeetings);

export default router;
