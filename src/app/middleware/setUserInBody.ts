import { RequestHandler } from "express";

export const setUserInBody: RequestHandler = async (req, res, next) => {
  try {
    req.body.user = req.user.userId;
    next();
  } catch (error) {
    next(error);
  }
};
