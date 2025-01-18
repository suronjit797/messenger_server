import { ObjectId, SortOrder } from "mongoose";
import { TUser } from "../app/modules/user/user.interface";
import { Request, Response } from "express";

export type IErrorMessages = {
  path: string | number;
  message: string;
};

export type IErrorPayload = {
  success: false;
  message: string;
  errorMessages: IErrorMessages[];
  stack?: unknown;
  statusCode?: number;
};

export type IMeta = {
  total: number;
  limit: number;
  page: number;
};

export type IPagination = {
  page: number;
  limit: number;
  skip: number;
  sortCondition: ISortCondition;
};

export type IPartialSearchableFields = string[];

export interface CustomJwtPayload {
  _id?: string;
  userId?: string;
  role?: string;
  iat?: string;
  exp?: string;
}

export type ISortCondition = { [key: string]: SortOrder };

export interface IGetAll_service<T> {
  data: T;
  meta: IMeta;
}

export type TFilter = { [key: string]: object };

export type TFile = File[] | { [fieldname: string]: File[] } | undefined;

export type TFiles = {
  [key: string]: Express.Multer.File[];
};

export interface baseResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}



export interface GraphqlContext {
  user?: TUser | null; // Adjust user properties based on your token's payload
  req: Request;
  res: Response;
}
