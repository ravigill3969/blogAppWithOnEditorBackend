import express from "express";
import {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getSingleBlogWithId,
} from "../controllers/blog";
import { verifyToken } from "../utils/validateToken";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/my-blogs", verifyToken, getMyBlogs);
router.get("/:id", getSingleBlogWithId);
router.post("/create", verifyToken, createBlog);

export default router;
