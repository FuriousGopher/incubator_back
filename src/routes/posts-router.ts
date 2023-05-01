import { Router } from 'express';
import { createNewPost, deletePostsById, getAllCommentsByPostId, getAllPosts, getPostsById, updatePostById } from '../controllers/postsController';
import { validatePostAndPutMethodsForPostsBody } from '../validators/postValidator';
import { checkAuthorization } from '../middlewares/checkAuthorization';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';
import { checkTokenAuth } from '../middlewares/checkTokenAuth';
import { validatorForComment } from '../validators/commentValidator';
import { createNewCommentByPostId } from '../controllers/commentsController';

export const postsRouter = Router();

postsRouter.get('/', getAllPosts);
postsRouter.get('/:postId/comments', getAllCommentsByPostId);
postsRouter.post('/:postId/comments', checkTokenAuth, validatorForComment, validationMiddleware, createNewCommentByPostId);
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', checkAuthorization, validatePostAndPutMethodsForPostsBody, validationMiddleware, createNewPost);
postsRouter.delete('/:id', checkAuthorization, deletePostsById);
postsRouter.put('/:id', checkAuthorization, validatePostAndPutMethodsForPostsBody, validationMiddleware, updatePostById);
