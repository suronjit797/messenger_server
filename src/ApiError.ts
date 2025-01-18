class ApiError extends Error {
  statusCode: number;
  constructor(status: number, message: string | undefined, stack = "") {
    super(message);
    this.statusCode = status;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

import { GraphQLError } from "graphql";
import httpStatus from "http-status";

export class gqlError extends GraphQLError {
  statusCode: number;

  constructor(status: number, message: string | undefined, stack = "", extensions = {}) {
    // Pass the message and extensions to the GraphQLError constructor
    super(message || "An error occurred", {
      extensions: {
        code: httpStatus[`${status}_NAME`] || "INTERNAL_SERVER_ERROR", // You can customize this based on your needs
        statusCode: status,
        ...extensions,
      },
      // Optionally, you can pass locations and path if needed
    });
    this.statusCode = status;

    // Capture stack trace if not provided
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
