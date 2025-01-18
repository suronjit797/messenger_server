import { Request, Response } from "express";

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).send({
    success: false,
    message: "Route not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "Route not found",
      },
    ],
  });
};
