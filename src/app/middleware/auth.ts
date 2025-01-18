import { Request, RequestHandler } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { CustomJwtPayload } from "../../shared/globalInterfaces";
import ApiError, { gqlError } from "../../ApiError";
import { userRole } from "../../constants/userConstants";
import jwt from "jsonwebtoken";
import UserModel from "../modules/user/user.model";
import { TUser } from "../modules/user/user.interface";

// Function to decode the JWT token and return user data
export const decodeToken = async (bearerToken: string): Promise<TUser | null> => {
  const [, token] = bearerToken.split(" ");

  if (!token) {
    return null;
  }

  const decoded = jwt.verify(token, config.token.access_token_secret) as CustomJwtPayload;
  const user = await UserModel.findById(decoded.userId);
  return user ? (user.toJSON() as TUser) : null;
};

// Express middleware to check user authorization
export const auth =
  (...roles: string[]): RequestHandler =>
  async (req, res, next) => {
    const roleNames = [...roles, userRole.superAdmin];
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const user = await decodeToken(bearerToken);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid user");
      }
      // Check if the user's role is allowed
      if (roles.length > 0 && !roleNames.includes(user.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized Access");
      }

      // Attach the user object to the request
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };

// Apollo GraphQL authentication for resolvers
export const apolloAuth = async (req: Request, ...roles: string[]): Promise<void> => {
  const roleNames = [...roles, userRole.superAdmin];

  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    throw new gqlError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  const user = await decodeToken(bearerToken);

  if (!user) {
    throw new gqlError(httpStatus.UNAUTHORIZED, "Invalid user");
  }

  // Check if the user's role is allowed
  if (roles.length > 0 && !roleNames.includes(user.role)) {
    throw new gqlError(httpStatus.FORBIDDEN, "Unauthorized Access");
  }

  // Attach the user object to the request
  req.user = user;
};
