import mongoose, { Document, Schema, Types } from "mongoose";

export interface IComment extends Document {
  comment: string;
  user: Types.ObjectId;
  blogId: Types.ObjectId;
  like: Types.ObjectId[];
  replies: Types.ObjectId[];
}

// Comment Schema
const CommentSchema = new Schema<IComment>(
  {
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    like: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply",
      },
    ],
  },
  { timestamps: true }
);

// Comment Model
const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
