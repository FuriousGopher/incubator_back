import {body} from 'express-validator';



export const validatePostAndPutMethodsForBlogsBody = [
    body('name')
        .isString()
        .isLength({ max: 15 })
        .withMessage('name max length 15')
        .trim()
        .notEmpty()
        .withMessage('name should not contain spaces'),
    body('description')
        .isLength({ max: 500 })
        .withMessage('description max length 500'),
    body('websiteUrl')
        .isLength({ max: 100 })
        .withMessage('websiteUrl max length 100')
        .isURL()
        .withMessage('Invalid URL'),
];


