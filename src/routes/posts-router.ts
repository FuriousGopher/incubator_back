import { Router } from 'express';
import { createNewPost, deletePostsById, getAllPosts, getPostsById, updatePostById } from '../controllers/postsController';
import { validatePostAndPutMethodsForPostsBody } from '../validators/postValidator';
import { checkAuthorization } from '../middlewares/checkAuthorization';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';

export const postsRouter = Router();

postsRouter.get('/', getAllPosts);
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', checkAuthorization, validatePostAndPutMethodsForPostsBody, validationMiddleware, createNewPost);
postsRouter.delete('/:id', checkAuthorization, deletePostsById);
postsRouter.put('/:id', checkAuthorization, validatePostAndPutMethodsForPostsBody, validationMiddleware, updatePostById);
