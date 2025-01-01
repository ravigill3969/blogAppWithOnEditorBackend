import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["token"];
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = (decoded as JwtPayload).id;
    // console.log(req.userId)
    next();
  } catch (error) {
    console.log("error verify token", error);
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
};
