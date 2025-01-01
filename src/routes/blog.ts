import express from "express";
import {
  createBlog,
  getAllBlogs,
  getSingleBlogWithId,
} from "../controllers/blog";
import { verifyToken } from "../utils/validateToken";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getSingleBlogWithId);
router.post("/create", verifyToken, createBlog);

export default router;
