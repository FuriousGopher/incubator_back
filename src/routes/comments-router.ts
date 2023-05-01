import { Router } from 'express';
import { checkTokenAuth } from '../middlewares/checkTokenAuth';
import { validatorForComment } from '../validators/commentValidator';
import { deleteCommentById, getCommentById, updateCommentById } from '../controllers/commentsController';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';

export const commentsRouter = Router();

commentsRouter.put('/:id', checkTokenAuth, validatorForComment, validationMiddleware, updateCommentById);
commentsRouter.delete('/:id', checkTokenAuth, deleteCommentById);
commentsRouter.get('/:id', getCommentById);
