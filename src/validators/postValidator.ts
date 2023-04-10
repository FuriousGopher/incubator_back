import {body, validationResult} from 'express-validator';
import { ErrorType } from '../types/errorType';
import { BlogsType } from '../types/blogsType';
import { blogs } from '../repositories/blogs-repositories';
import {Request, Response, NextFunction} from "express";

function blogExists(blogId: string, blogs: BlogsType[]): boolean {
    return blogs.some((blog) => blog.id === blogId);
}

export const validatePostAndPutMethodsForPostsBody = [
    body('title')
        .isLength({ max: 30 })
        .withMessage('title max length 30')
        .notEmpty(),
    body('shortDescription')
        .isLength({ max: 100 })
        .withMessage('shortDescription max length 100')
        .notEmpty(),
    body('content')
        .isLength({ max: 1000 })
        .withMessage('content max length 1000')
        .notEmpty(),
    body('blogId')
        .notEmpty()
        .withMessage('blogId must be included')
        .custom((value, { req }) => {
            if (!blogExists(value, blogs)) {
                throw new Error('blogId doesnt match');
            }
            return true;
        }),
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
