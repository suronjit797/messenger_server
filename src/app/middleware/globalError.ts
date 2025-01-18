import { ErrorRequestHandler, Request, Response } from "express";
import config from "../../config";
import { handleValidationError } from "../../ErrorHandler/HandlerValidationError";
import { IErrorMessage } from "../../interfaces/genericError";
import { errorLogger } from "../../shared/logger";
import { ZodError } from "zod";
import { handleZodError } from "../../ErrorHandler/handleZodError";

type TErrorResponse = {
  success: boolean;
  message: string;
  errorMessages: IErrorMessage[];
  stack?: unknown;
};

const globalError: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error occurred";
  let errorMessages: IErrorMessage[] = [
    {
      path: "",
      message: error.message || "Internal server error occurred",
    },
  ];

  if (error?.name === "ValidationError") {
    // mongodb error
    const genericError = handleValidationError(error);
    errorMessages = genericError.errorMessages;
    statusCode = genericError.statusCode;
    message = genericError.message;
  } else if (error instanceof ZodError) {
    //zod validation error
    const zodError = handleZodError(error);
    errorMessages = zodError.errorMessages;
    statusCode = zodError.statusCode;
    message = zodError.message;
  }

  // console error
  errorLogger(` [${statusCode}]: ${message}`);

  // error response
  const errorResponse: TErrorResponse = {
    success: false,
    message,
    errorMessages,
  };
  if (config.NODE_ENV !== "production") {
    errorResponse.stack = error?.stack;
  }

  return res.status(statusCode).send(errorResponse);
};

export default globalError;



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

