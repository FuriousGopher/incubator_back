import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ErrorType } from '../types/errorType';
import { HttpStatusCode } from '../types/HTTP-Response';

export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMessages: ErrorType[] = errors.array({ onlyFirstError: true }).map((error) => {
      return { message: error.msg, field: error.param };
    });
    return res.status(HttpStatusCode.BadRequest).json({ errorsMessages: errorsMessages });
  }
  next();
};
