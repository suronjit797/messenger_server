import { z } from "zod";
import { userRole } from "../../../constants/userConstants";

export const userCreateValidationZod = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    role: z.enum(Object.values(userRole) as [string, ...string[]]).optional(),
    password: z.string(),
  }),
});

export const userLoginValidationZod = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

export const userUpdateValidationZod = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    role: z.enum(Object.values(userRole) as [string, ...string[]]).optional(),
    password: z.string().optional(),

  }),
});
