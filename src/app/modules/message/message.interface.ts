import { Model, ObjectId } from "mongoose";
import { IMeta, IPagination } from "../../../shared/globalInterfaces";

export interface IMessage {
  _id?: string;
  users: ObjectId[] | String[];
  isGroup: boolean;
  sender: ObjectId;
  message: string;
}

export type IMessageModel = Model<IMessage, Record<string, unknown>>;

// gql
export interface MessageQueryInput extends IMessage {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  search?: string;
  [key: string]: unknown;
}

export interface MessagePaginationArgs {
  pagination: IPagination;
  query: MessageQueryInput;
}

export interface GetAllMessages {
  meta: IMeta;
  data: IMessage[] | null;
}
