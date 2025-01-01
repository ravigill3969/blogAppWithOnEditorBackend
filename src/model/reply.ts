import mongoose, { Schema } from "mongoose";

interface IReply {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt?: Date;
}

const ReplySchema = new Schema<IReply>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Reply = mongoose.model<IReply>("Reply", ReplySchema);

export default Reply;
