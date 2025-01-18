import { Schema, model } from "mongoose";
import { TEvent, TEventModel } from "./event.interface";

const eventSchema = new Schema<TEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EventModel = model<TEvent, TEventModel>("Event", eventSchema);

export default EventModel;
