import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'

export const validatorMiddleware =
  (validatorZod: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {     
      await validatorZod.parseAsync(req)

      return next()
    } catch (error) {
      next(error)
    }
  }
