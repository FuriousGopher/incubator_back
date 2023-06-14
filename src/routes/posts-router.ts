import { Router } from 'express';
import {
  createNewPost,
  deletePostsById,
  getAllCommentsByPostId,
  getAllPosts,
  getPostsById,
  updateLikeStatusForPost,
  updatePostById,
} from '../controllers/postsController';
import { validatePostAndPutMethodsForPostsBody } from '../validators/validatorForNewPost';
import { checkBasicAuth } from '../middlewares/checkBasicAuth';
import { validationMiddleware } from '../validators/ValidationErorrsMiddleware';
import { checkTokenAuth } from '../middlewares/checkTokenAuth';
import { validatorForComment } from '../validators/validatorForNewComment';
import { createNewCommentByPostId } from '../controllers/commentsController';
import { validatorForLikes } from '../validators/validatorForLikes';

export const postsRouter = Router();

postsRouter.get('/', getAllPosts);
postsRouter.get('/:postId/comments', getAllCommentsByPostId);
postsRouter.post(
  '/:postId/comments',
  checkTokenAuth,
  validatorForComment,
  validationMiddleware,
  createNewCommentByPostId,
);
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', checkBasicAuth, validatePostAndPutMethodsForPostsBody, validationMiddleware, createNewPost);
postsRouter.delete('/:id', checkBasicAuth, deletePostsById);
postsRouter.put('/:id', checkBasicAuth, validatePostAndPutMethodsForPostsBody, validationMiddleware, updatePostById);
postsRouter.put('/:id/like-status', checkTokenAuth, validatorForLikes, validationMiddleware, updateLikeStatusForPost);
