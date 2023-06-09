import { testRouter } from '../routes/testing-route';
import { blogsRouter } from '../routes/blogs-router';
import { postsRouter } from '../routes/posts-router';
import { authRouter } from '../routes/auth-router';
import { checkBasicAuth } from '../middlewares/checkBasicAuth';
import { usersRouter } from '../routes/users-router';
import express, { Request, Response } from 'express';
import { commentsRouter } from '../routes/comments-router';
import path from 'path';
import { securityRouter } from '../routes/security-router';
import { validatorForRefreshToken } from '../validators/validatorForRefreshToken';

export const router = express.Router();

router.use('/testing', testRouter);

router.use('/blogs', blogsRouter);

router.use('/comments', commentsRouter);

router.use('/posts', postsRouter);

router.use('/auth', authRouter);

router.use('/users', checkBasicAuth, usersRouter);

router.use('/security', validatorForRefreshToken, securityRouter);

router.use('/', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, '../home.html');
  res.sendFile(filePath);
});
