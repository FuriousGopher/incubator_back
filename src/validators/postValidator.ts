import { body } from 'express-validator';
import { blogsRepositories } from '../repositories/blogs-repositories';

async function blogExists(blogId: string): Promise<boolean> {
  const blog = await blogsRepositories.getBlogById(blogId);
  return !!blog;
}

export const validatePostAndPutMethodsForPostsBody = [
  body('title').isString().trim().isLength({ max: 30 }).withMessage('title max length 30').notEmpty(),
  body('shortDescription').isString().trim().isLength({ max: 100, min: 1 }).withMessage('shortDescription max length 100').notEmpty(),
  body('content').isString().trim().isLength({ max: 1000 }).withMessage('content max length 1000').notEmpty(),
  body('blogId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('blogId must be included')
    .custom(async (value) => {
      if (!(await blogExists(value))) {
        throw new Error('blogId doesnt match');
      }
      return true;
    }),
];
