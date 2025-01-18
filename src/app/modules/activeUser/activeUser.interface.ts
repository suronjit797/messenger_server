import { Model } from "mongoose";

export interface IActiveUser {
    userId: string
    socketId: string
}

export type IActiveUserModel = Model<IActiveUser, Record<string, unknown>>;
