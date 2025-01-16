import { Prisma, PrismaClient } from "@prisma/client";
import { hash, checkHash } from "../config.ts/hash";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret_key } from "../util/secrets";
import { check, validationResult } from "express-validator";

const prisma = new PrismaClient();

const generateToken = (username: string) => {
  const payload = {
    username: username,
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
      const token = generateToken(user.email);
      res.status(200).json({ token });
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } else {
    res.status(400).send("user not found!");
  }
};
