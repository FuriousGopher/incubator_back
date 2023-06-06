import { Router } from 'express';
import { createNewPost, deletePostsById, getAllCommentsByPostId, getAllPosts, getPostsById, updatePostById } from '../controllers/postsController';
import { validatePostAndPutMethodsForPostsBody } from '../validators/validatorForNewPost';
import { checkAuthorization } from '../middlewares/checkAuthorization';
import { validationMiddleware } from '../validators/ValidationErorrsMiddleware';
import { checkTokenAuth } from '../middlewares/checkTokenAuth';
import { validatorForComment } from '../validators/validatorForNewComment';
import { createNewCommentByPostId } from '../controllers/commentsController';

export const postsRouter = Router();

postsRouter.get('/', getAllPosts);
postsRouter.get('/:postId/comments', getAllCommentsByPostId);
postsRouter.post('/:postId/comments', checkTokenAuth, validatorForComment, validationMiddleware, createNewCommentByPostId);
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', checkAuthorization, validatePostAndPutMethodsForPostsBody, validationMiddleware, createNewPost);
postsRouter.delete('/:id', checkAuthorization, deletePostsById);
postsRouter.put('/:id', checkAuthorization, validatePostAndPutMethodsForPostsBody, validationMiddleware, updatePostById);
