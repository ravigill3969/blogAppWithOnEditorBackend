import express from "express";
import {
  addComment,
  deleteComment,
  getCommentWithBlogId,
  likeComment,
  updateComment,
} from "../controllers/comment";
import { verifyToken } from "../utils/validateToken";

const router = express.Router();

router.get("/get-comments-Bid/:blogId", getCommentWithBlogId);
router.post("/add-comment", verifyToken, addComment);
router.put("/update-comment/:id", verifyToken, updateComment);
router.put("/like-comment/", verifyToken, likeComment);
router.delete("/delete-comment/:id", verifyToken, deleteComment);

export default router;
