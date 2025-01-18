import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import config from "../../../config";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload, IPagination, IGetAll_service, TFilter } from "../../../shared/globalInterfaces";
import { userRole } from "../../../constants/userConstants";
import mongoose from "mongoose";

type LoginPayload = {
  email: string;
  password: string;
};
type LoginRes = { accessToken: string; refreshToken: string };

// auth
export const createUserService = async (user: TUser): Promise<TUser | null> => {
  const isExist = await UserModel.findOne({ email: user.email });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  if (!user.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const password = await bcrypt.hash(user.password, bcrypt.genSaltSync(config.sault_round));
  const userData = { ...user, password };

  const newUser = await UserModel.create(userData);
  return newUser;
};

export const loginService = async (payload: LoginPayload): Promise<LoginRes> => {
  const isExist = await UserModel.findOne({ email: payload.email });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Dose not Exist");
  }

  const match = await bcrypt.compare(payload.password, isExist.password as string);

  if (!match) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User and password not matched");
  }

  const accessToken = jwt.sign({ userId: isExist._id }, config.token.access_token_secret, {
    expiresIn: config.token.access_token_time,
  });
  const refreshToken = jwt.sign({ userId: isExist._id }, config.token.refresh_token_secret, {
    expiresIn: config.token.refresh_token_time,
  });

  return {
    accessToken,
    refreshToken,
  };
};

// export const getProfile_service = async (id: string): Promise<TUser | null> => {
//   const data = await UserModel.findById(id).select({ password: 0 });
//   return data;
// };

export const updateProfile_service = async (id: string, payload: Partial<TUser>): Promise<TUser | null> => {
  const data = await UserModel.findByIdAndUpdate(id, { $set: payload }, { new: true });
  return data;
};

// user
export const getAll_service = async (
  pagination: IPagination,
  filter: TFilter
): Promise<IGetAll_service<TUser[] | null>> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await UserModel.find(filter).limit(limit).skip(skip).sort(sortCondition).select({ password: 0 });
  const total = await UserModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};
export const getSingle_service = async (id: string): Promise<Partial<TUser> | null> => {
  return await UserModel.findById(id).select({ password: 0 });
};
export const update_service = async (id: string, payload: TUser): Promise<TUser | null> => {
  const data = await UserModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};
export const remove_service = async (id: string): Promise<any> => {
  const data = await UserModel.findByIdAndDelete(id);
  return data;
};
