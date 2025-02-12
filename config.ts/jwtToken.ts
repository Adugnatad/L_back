import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secret_key } from "../util/secrets";

interface CustomRequest extends Request {
  decoded?: string | object;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.header("Authorization")
    ? req.header("Authorization")?.replace("Bearer ", "")
    : req.cookies.Authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(authToken, secret_key);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
