import { z } from "zod";

export const eventCreateValidate = z.object({
  body: z.object({
    title: z.string(),
    date: z.string(),
  }),
});

export const eventUpdateValidate = z.object({
  body: z.object({
    title: z.string(),
    date: z.string().optional(),
  }),
});
