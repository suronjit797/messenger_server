import { Schema, model } from "mongoose";
import { IMessage, IMessageModel } from "./message.interface";

const messageSchema = new Schema<IMessage>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isGroup: { type: Boolean, default: false },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const MessageModel = model<IMessage, IMessageModel>("Message", messageSchema);

export default MessageModel;
