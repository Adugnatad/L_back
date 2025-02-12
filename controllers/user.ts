import { Prisma, PrismaClient } from "@prisma/client";
import { hash, checkHash } from "../config.ts/hash";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret_key } from "../util/secrets";
import { check, validationResult } from "express-validator";

interface CustomRequest extends Request {
  decoded?: { phone_number: string };
}

const prisma = new PrismaClient();

const generateToken = (username: string) => {
  const payload = {
    phone_number: username,
  };
  const token = jwt.sign(payload, secret_key, { expiresIn: "1h" });
  return token;
};

export const signup = async (req: Request, res: Response) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone_number,
    date_of_birth,
  } = req.body;

  // await check("gender", "gender can be either MALE or FEMALE")
  //   .isIn(["MALE", "FEMALE"])
  //   .run(req);

  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(403).send(errors);
  // }

  const hashedPassword = await hash(password);
  if (hashedPassword) {
    const u = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (u) {
      res.status(403).send("email already exists");
    } else {
      const user = await prisma.user
        .create({
          data: {
            email,
            password: hashedPassword,
            first_name,
            last_name,
            phone_number,
            date_of_birth,
            status: "active",
          },
        })
        .then((user) => {
          res.json({
            message: "User created successfully",
          });
        })
        .catch((err) => {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
              res.status(403).send("Invalid request. Unique Constraint failed");
            } else {
              res.status(403).json(err.message);
            }
          } else {
            res.status(500).send(err);
          }
        });
    }
  } else {
    res.status(500).send("password hash failed");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    const passwordCheck = checkHash(password, user.password);
    if (passwordCheck) {
      const token = generateToken(user.phone_number);
      res.cookie("Authorization", token, {
        httpOnly: true, // Prevent access from JavaScript
        secure: process.env.NODE_ENV === "production", // Set true in production (requires HTTPS)
        sameSite: "strict", // Protect against CSRF
      });
      res.status(200).json({ token });
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } else {
    res.status(400).send("user not found!");
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("Authorization", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updatePersonalInformation = async (
  req: CustomRequest,
  res: Response
) => {
  const { first_name, last_name, date_of_birth, email, phone_number } =
    req.body;

  try {
    const user = await prisma.user.update({
      where: { phone_number: req.decoded.phone_number },
      data: {
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        email: email,
      },
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error updating personal information:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update personal information",
    });
  }
};

export const updatePassword = async (req: CustomRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { phone_number: req.decoded.phone_number },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await checkHash(currentPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(403)
        .json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await hash(newPassword);
    await prisma.user.update({
      where: { phone_number: req.decoded.phone_number },
      data: { password: hashedPassword },
    });

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update password" });
  }
};
