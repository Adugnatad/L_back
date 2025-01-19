const express = require("express");
import { getPackages } from "../controllers/packages";

const router = express.Router();

router.get("/:amount?/:term?", getPackages);

export default router;
