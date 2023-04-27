import { videosRouter } from '../routes/videos-router';
import { testRouter } from '../routes/testing-route';
import { blogsRouter } from '../routes/blogs-router';
import { postsRouter } from '../routes/posts-router';
import { authRouter } from '../routes/auth-router';
import { checkAuthorization } from '../middlewares/checkAuthorization';
import { usersRouter } from '../routes/users-router';
import express, { Request, Response } from 'express';
import { commentsRouter } from '../routes/comments-router';

export const router = express.Router();

router.use('/videos', videosRouter);

router.use('/testing', testRouter);

router.use('/blogs', blogsRouter);

router.use('/comments', commentsRouter);

router.use('/posts', postsRouter);

router.use('/auth', authRouter);

router.use('/users', checkAuthorization, usersRouter);
router.use('/', (req: Request, res: Response) => {
  const file = __dirname + '/home.html';
  res.sendFile(file);
});
