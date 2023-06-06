import { body } from 'express-validator';

export const createUserValidator = [
  body('login')
    .isString()
    .trim()
    .isLength({ max: 10, min: 3 })
    .withMessage('title max length 30 and min 3')
    .notEmpty()
    .matches(/^[a-zA-Z0-9_-]*$/),
  body('password')
    .isString()
    .trim()
    .notEmpty()
    .isLength({
      max: 20,
      min: 6,
    })
    .withMessage('password max length 20 and min 6'),
  body('email').isString().trim().notEmpty().isEmail().withMessage('email not valid'),
];
