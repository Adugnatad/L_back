const express = require("express");
import { setMeeting, pullFunds, giveRating } from "../controllers/rm";

const router = express.Router();

router.post("/meeting", setMeeting);
router.post("/funds", pullFunds);
router.post("/rating", giveRating);

export default router;
