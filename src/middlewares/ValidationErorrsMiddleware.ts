import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {ErrorType} from "../types/errorType";

export const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages: ErrorType[] = errors.array({onlyFirstError: true}).map((error) => {
            return { message: error.msg, field: error.param };
        });
        return res.status(400).json({ errorsMessages: errorMessages });
    }
    next();
}