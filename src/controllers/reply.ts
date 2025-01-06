import { Request, Response, NextFunction } from "express";
import Reply from "../model/reply";
import Comment from "../model/comment";

export const addReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.id;
    const userID = req.userId;
    const { replyContent } = req.body;

    if (replyContent.trim() === "") {
      res.status(400).json({
        message: "Reply is required",
      });
      return;
    }

    const reply = await Reply.create({
      content: replyContent,
      user: userID,
      comment: commentId,
    });

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId }, // Filter condition
      { $push: { replies: reply._id } }, // Update operation
      { new: true } // Options
    );

    console.log(comment);

    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.id;
    if (!commentId) {
      res.status(400).json({
        message: "Comment donot exist!!",
      });
    }
    const replies = await Reply.find({ comment: commentId }).populate(
      "user",
      "username imageUrl"
    );
    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
