import {body, validationResult} from 'express-validator';
import { ErrorType } from '../types/errorType';
import {Request, Response, NextFunction} from "express";

export const validatePostAndPutMethodsForBlogsBody = [
    body('name')
        .isLength({ max: 15 })
        .withMessage('name max length 15')
        .matches(/^[^\s]+$/)
        .withMessage('name should not contain spaces'),
    body('description')
        .isLength({ max: 500 })
        .withMessage('description max length 500'),
    body('websiteUrl')
        .isLength({ max: 100 })
        .withMessage('websiteUrl max length 100')
        .isURL()
        .withMessage('Invalid URL'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages: ErrorType[] = errors.array().map((error) => {
                return { message: error.msg, field: error.param };
            });
            return res.status(400).json({ errors: errorMessages });
        }
        next();
    },
];




