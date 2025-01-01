import { Request, Response, NextFunction } from "express";
import User from "../model/user";
import jwt from "jsonwebtoken";

import profilePicEmojis from "../utils/emoji";

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * profilePicEmojis.length);
  return profilePicEmojis[randomIndex];
};

import bcrypt from "bcryptjs";

function generateToken(userId: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 1 hour
  });

  return token;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(401).json({
        message: "username already in use",
      });
      return;
    }
    
    const hashPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      email,
      password: hashPassword,
      username,
      imageUrl: getRandomEmoji(),
    });
    console.log(user)

    const token = generateToken(user._id as string);
    console.log(token)
    res
      .cookie("token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "none",
      })
      .status(200)
      .json({
        message: "Success",
      });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const token = generateToken(user._id as string);

    res
      .cookie("token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .status(200)
      .json({
        message: "Success",
      });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("token", "1", {
      maxAge: 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
