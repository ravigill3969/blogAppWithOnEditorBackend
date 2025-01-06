import express from "express";
import { addReply, getReply } from "../controllers/reply";
import { verifyToken } from "../utils/validateToken";

const router = express.Router();

router.get("/get-reply/:id", verifyToken, getReply);
router.post("/add-reply/:id", verifyToken, addReply);

export default router;
