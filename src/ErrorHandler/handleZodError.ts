import { IErrorMessage } from "../interfaces/genericError";
import { ZodError, ZodIssue } from "zod";

export const handleZodError = (err: ZodError) => {
  const errors: IErrorMessage[] = err.errors.map((item: ZodIssue) => ({
    path: item?.path[0],
    // message: `${item?.path[0]} is ${item?.message}`,
    message: item.path.join("/") +' is ' + item?.message,
  }));

  const result = {
    success: false,
    errorMessages: errors,
    message: "Validation Error",
    statusCode: 403,
  };
  return result;
};
