const express = require("express");
import { verifyToken } from "../config.ts/jwtToken";
import {
  setMeeting,
  pullFunds,
  giveRating,
  getMeetings,
  deleteMeeting,
  getPullFundRequests,
  deleteFundTransferRequest,
  getRatings,
} from "../controllers/rm";

const router = express.Router();

router.post("/meeting", verifyToken, setMeeting);
router.get("/get_meetings", verifyToken, getMeetings);
router.delete("/meeting/:id", verifyToken, deleteMeeting);

router.post("/funds", verifyToken, pullFunds);
router.get("/get_fund_requests", verifyToken, getPullFundRequests);
router.delete("/fund_request/:id", verifyToken, deleteFundTransferRequest);

router.post("/rating", verifyToken, giveRating);
router.get("/get_ratings", verifyToken, getRatings);

export default router;
