import { Router } from 'express';
import {
  createNewBlog,
  createNewPostByBlogId,
  deleteBlogById,
  getAllBlogs,
  getAllPostsByBlogId,
  getBlogById,
  updateBlogById,
} from '../controllers/blogsController';
import { validatePostAndPutMethodsForBlogsBody } from '../validators/validatorForNewBlog';
import { checkBasicAuth } from '../middlewares/checkBasicAuth';
import { validationMiddleware } from '../validators/validationErorrsMiddleware';
import { validatePostMethodsForPostsByBlogId } from '../validators/validatorForNewPostByBlogId';
import { getUserIdFromToken } from '../middlewares/getUserIdFromToken';

export const blogsRouter = Router();

blogsRouter.get('/', getAllBlogs);
blogsRouter.get('/:blogId/posts', getUserIdFromToken, getAllPostsByBlogId);
blogsRouter.get('/:id', getBlogById);
blogsRouter.post(
  '/:blogId/posts',
  checkBasicAuth,
  validatePostMethodsForPostsByBlogId,
  validationMiddleware,
  createNewPostByBlogId,
);
blogsRouter.post('/', checkBasicAuth, validatePostAndPutMethodsForBlogsBody, validationMiddleware, createNewBlog);
blogsRouter.delete('/:id', checkBasicAuth, deleteBlogById);
blogsRouter.put('/:id', checkBasicAuth, validatePostAndPutMethodsForBlogsBody, validationMiddleware, updateBlogById);
