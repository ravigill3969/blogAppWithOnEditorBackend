import { timeStamp } from "console";
import mongoose, { Document, Schema, ObjectId, Types } from "mongoose";

// Interface for a single blog info item
interface IBlogInfo {
  type: string; // 'paragraph', 'image', etc.
  content: string; // The actual content or URL
}

// Interface for the Blog document
export interface IBlog extends Document {
  title: string; // Blog title
  blogInfo: IBlogInfo[]; // Array of blog content blocks
  author: ObjectId; // Reference to the author's ObjectId
  likes: ObjectId[]; // Array of User ObjectIds who liked the blog
  comments: Types.ObjectId[]; // Array of comments
  category: string;
  value: string;
}

// Schema for BlogInfo
const BlogInfoSchema = new Schema<IBlogInfo>({
  type: { type: String, required: true },
  content: { type: String, required: true },
});

// Schema for Blog
const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    value: { type: String, default: "" },
    blogInfo: { type: [BlogInfoSchema], required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of users who liked the blog
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Array of comments
    category: { type: String, default: "" },
  },
  { timestamps: true }
);

// Mongoose model
const Blog = mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
