import { Router } from 'express';

export const commentsRouter = Router();

commentsRouter.put('/:id');
commentsRouter.delete('/:id');
commentsRouter.get('/:id');
