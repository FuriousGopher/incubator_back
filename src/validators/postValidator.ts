import {body, validationResult} from 'express-validator';
import { BlogsType } from '../types/blogsType';
import { blogs } from '../repositories/blogs-repositories';

function blogExists(blogId: string, blogs: BlogsType[]): boolean {
    return blogs.some((blog) => blog.id === blogId);
}

export const validatePostAndPutMethodsForPostsBody = [
    body('title')
        .isString()
        .trim()
        .isLength({ max: 30 })
        .withMessage('title max length 30')
        .notEmpty(),
    body('shortDescription')
        .isLength({ max: 100 })
        .withMessage('shortDescription max length 100')
        .notEmpty(),
    body('content')
        .isString()
        .trim()
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
];
