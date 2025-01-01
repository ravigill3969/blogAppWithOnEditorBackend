import express, { Request, Response } from "express";
import { login, register } from "../controllers/user";
import { verifyToken } from "../utils/validateToken";

const router = express.Router();

router.post("/register", register);
router.post("/login", (req,res,next) => {console.log(req.body) ; next()}, login);
router.post("/logout", login);
router.get(
  "/validate-token",
  verifyToken,
  async (req: Request, res: Response) => {
    res.status(200).json({ userId: req.userId });
  }
);

export default router;
