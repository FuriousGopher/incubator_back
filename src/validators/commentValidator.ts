import { body } from 'express-validator';

export const validatorForCommentByPostId = [
  body('content')
    .isString()
    .trim()
    .isLength({
      max: 300,
      min: 20,
    })
    .withMessage('Comment max 300 characters min 20')
    .notEmpty(),
];
