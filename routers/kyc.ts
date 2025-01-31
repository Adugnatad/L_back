const express = require("express");
import { submitKYCForm, getKYCDetails } from "../controllers/kyc";
import multer from "multer";
import { verifyToken } from "../config.ts/jwtToken";
import { upload } from "../middlewares/fileUploads";

const router = express.Router();

router.post(
  "/kyc-submit",
  verifyToken,
  upload.fields([
    { name: "passportPhotos", maxCount: 1 },
    { name: "idScan", maxCount: 1 },
  ]),
  submitKYCForm
);

router.get("/kyc-details", verifyToken, getKYCDetails);

export default router;
