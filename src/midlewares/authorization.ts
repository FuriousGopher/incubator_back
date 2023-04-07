import {Request, Response, NextFunction} from "express";
import {body, validationResult} from "express-validator";

export const loginValidationRules = [
    body('login').equals('admin').withMessage('Wrong username'),
    body('password').equals('qwerty').withMessage('Wrong password'),
];
export const validateLogin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = errors.array().map((error) => error.msg);
    return res.status(422).json({
        errors: extractedErrors,
    });
};