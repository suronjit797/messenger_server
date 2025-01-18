import { Schema, model } from "mongoose";
import { IActiveUser, IActiveUserModel } from "./activeUser.interface";

const activeUserSchema = new Schema<IActiveUser>(
  {
    userId: { type: String, required: true },
    socketId: { type: String, required: true },
  },
  { timestamps: true }
);

const ActiveUserModel = model<IActiveUser, IActiveUserModel>("ActiveUser", activeUserSchema);

export default ActiveUserModel;
