import {body} from 'express-validator';
import { BlogsType } from '../models/blogsType';
import { __blogs } from '../repositories/blogs-repositories';

function blogExists(blogId: string, blogs: BlogsType[]): BlogsType | undefined {
    return blogs.find((blog) => blog.id === blogId);
}

export const validatePostAndPutMethodsForPostsBody = [
    body('title')
        .isString()
        .trim()
        .isLength({ max: 30 })
        .withMessage('title max length 30')
        .notEmpty(),
    body('shortDescription')
        .isString()
        .trim()
        .isLength({ max: 100, min: 1})
        .withMessage('shortDescription max length 100')
        .notEmpty(),
    body('content')
        .isString()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('content max length 1000')
        .notEmpty(),
    body('blogId')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('blogId must be included')
        .custom((value, { req }) => {
            if (!blogExists(value, __blogs)) {
                throw new Error('blogId doesnt match');
            }
            return true;
        }),
];
