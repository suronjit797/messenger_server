import { Model, ObjectId } from "mongoose";

export type TEvent = {
  title: string;
  date: string;
  user: ObjectId;
};

export type TEventModel = Model<TEvent, Record<string, unknown>>;
