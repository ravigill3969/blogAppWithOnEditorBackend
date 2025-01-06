import { NextFunction, Request, Response } from "express";
import Comment, { IComment } from "../model/comment";
import Blog from "../model/blog";
import { Types } from "mongoose";

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { blogId, commentText } = req.body;
    let userId = req.userId;
    console.log(userId, blogId, commentText);
    if (commentText.length < 1) {
      res.status(400).json({
        message: "Comment cannot be empty",
      });
      return;
    }

    userId = userId?.toString();
    blogId = blogId.toString();

    if (!blogId || !commentText || !userId) {
      res.status(400).json({
        message: "Blog ID, comment text, and user ID are required.",
      });
      return;
    }

    const comment: IComment = await Comment.create({
      comment: commentText,
      user: new Types.ObjectId(userId),
      blogId: new Types.ObjectId(blogId),
    });

    if (!comment) {
      res.status(400).json({
        message: "Failed to create comment.",
      });
      return;
    }

    let commentID = comment["_id"];

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { comments: commentID },
      },
      {
        new: true,
      }
    );

    if (!blog) {
      res.status(500).json({
        message: "Failed to create comment.",
      });
      return;
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCommentWithBlogId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blogId: blogId }).populate(
      "user",
      "username imageUrl"
    );
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;
    const { commentText } = req.body;

    if (!commentText || commentText.trim() === "") {
      res.status(400).json({
        message: "Comment text cannot be empty",
        code: "EMPTY_COMMENT_TEXT",
      });
      return;
    }

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: userId },
      { comment: commentText },
      { new: true }
    );

    if (!comment) {
      res.status(404).json({
        message: "Comment not found or unauthorized",
        code: "COMMENT_NOT_FOUND_OR_UNAUTHORIZED",
      });
      return;
    }

    res.status(200).json({
      message: "Comment updated successfully",
      updatedComment: comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentID = req.params.id;
    const userId = req.userId;
    const comment = await Comment.findById(commentID);

    if (!comment) {
      res.status(404).json({
        message: "This comment no longer exists",
      });
      return;
    }

    if (comment.user._id.toString() !== userId?.toString()) {
      res.status(401).json({
        message: "You are not allowed to delete this comment.",
      });
      return;
    }

    await Comment.findByIdAndDelete(commentID);

    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const likeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { commentId } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      { _id: commentId },
      { $addToSet: { like: userId } },
      { new: true }
    );

    if (!comment) {
      res.status(404).json({
        error: {
          message: "Comment not found",
          code: "COMMENT_NOT_FOUND",
        },
      });
      return;
    }

    res.status(200).json({
      message: "Comment liked successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};
