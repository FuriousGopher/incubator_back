import { Router } from 'express';
import { checkTokenAuth } from '../middlewares/checkTokenAuth';
import { validatorForComment } from '../validators/commentValidator';
import {
  deleteCommentById,
  getCommentById,
  updateCommentById,
  updateLikeStatus,
} from '../controllers/commentsController';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';
import { validatorForLikes } from '../validators/validatorForLikes';

export const commentsRouter = Router();

commentsRouter.put('/:id', checkTokenAuth, validatorForComment, validationMiddleware, updateCommentById);
commentsRouter.delete('/:id', checkTokenAuth, deleteCommentById);
commentsRouter.get('/:id', getCommentById);
commentsRouter.put('/:id/like-status', checkTokenAuth, validatorForLikes, validationMiddleware, updateLikeStatus);
