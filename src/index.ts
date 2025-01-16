import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import express, { Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import userRoutes from "../routers/user";
import purposeRoutes from "../routers/purpose";
import requirementRoutes from "../routers/requirements";
import loanTypeRoutes from "../routers/loan_type";
import loanRoutes from "../routers/loan";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(compression());
app.use("/api/user", userRoutes);
app.use("/api/purpose", purposeRoutes);
app.use("/api/requirement", requirementRoutes);
app.use("/api/loan_type", loanTypeRoutes);
app.use("/api/loan", loanRoutes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that Api!");
});

app.listen(4000, () => {
  console.log("Express server is running on port 4000");
});
