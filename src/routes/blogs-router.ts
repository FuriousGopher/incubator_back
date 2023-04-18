import { Router } from 'express';
import { createNewBlog, createNewPostByBlogId, deleteBlogById, getAllBlogs, getAllPostsByBlogId, getBlogById, updateBlogById } from '../controllers/blogsController';
import { validatePostAndPutMethodsForBlogsBody } from '../validators/blogsValidator';
import { checkAuthorization } from '../middlewares/checkAuthorization';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';
import { validatePostMethodsForPostsByBlogId } from '../validators/blogValidatorForPostMetchod';

export const blogsRouter = Router();

blogsRouter.get('/', getAllBlogs);
blogsRouter.get('/:blogId/posts', getAllPostsByBlogId);
blogsRouter.get('/:id', getBlogById);
blogsRouter.post('/:blogId/posts', checkAuthorization, validatePostMethodsForPostsByBlogId, validationMiddleware, createNewPostByBlogId);
blogsRouter.post('/', checkAuthorization, validatePostAndPutMethodsForBlogsBody, validationMiddleware, createNewBlog);
blogsRouter.delete('/:id', checkAuthorization, deleteBlogById);
blogsRouter.put('/:id', checkAuthorization, validatePostAndPutMethodsForBlogsBody, validationMiddleware, updateBlogById);
