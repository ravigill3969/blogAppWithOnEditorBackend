import { NextFunction, Request, Response } from "express";
import Blog from "../model/blog";

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content: blogInfo, value } = req.body;

    if (!title || title.trim().length < 1) {
      res.status(400).json({
        message: "Title is required",
      });
      return;
    }

    if (!blogInfo || !Array.isArray(blogInfo) || blogInfo.length < 1) {
      res.status(400).json({
        message: "Content is required",
      });
      return;
    }

    for (const block of blogInfo) {
      if (!block.type || !block.content) {
        res.status(400).json({
          message: "Each content block must have a type and content",
        });
        return;
      }
    }

    const author = req.userId;

    const blog = await Blog.create({
      title,
      blogInfo,
      author,
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await Blog.find({}).populate("author");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getSingleBlogWithId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    let blog = await Blog.findById(id);
    if (!blog) {
      res.status(500).json({
        message: "Blog no longer exist!",
      });
      return;
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const blogs = await Blog.find({ author: userId });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
