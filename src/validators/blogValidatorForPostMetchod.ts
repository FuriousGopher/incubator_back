import { body } from 'express-validator';

export const validatePostMethodsForPostsByBlogId = [
  body('title').isString().trim().isLength({ max: 30 }).withMessage('title max length 30').notEmpty(),
  body('shortDescription').isString().trim().isLength({ max: 100, min: 1 }).withMessage('shortDescription max length 100').notEmpty(),
  body('content').isString().trim().isLength({ max: 1000 }).withMessage('content max length 1000').notEmpty(),
];
