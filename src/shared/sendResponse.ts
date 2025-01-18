import { Response } from "express";
import { IMeta } from "./globalInterfaces";

type TPayload<T> = {
  success: boolean;
  message: string;
  meta?: IMeta;
  data?: T;
};

const sendRes = <T>(res: Response, status: number, payload: TPayload<T>) => {
  const { success, message, data, meta } = payload;
  const response: TPayload<T> = { success, message };
  if (meta) {
    response.meta = meta;
  }

  response.data = data;

  return res.status(status).send(response);
};

export default sendRes;
