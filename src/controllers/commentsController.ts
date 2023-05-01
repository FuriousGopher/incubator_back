import { Request, Response } from 'express';
import { HttpStatusCode } from '../types/HTTP-Response';
import { postsRepositories } from '../repositories/posts-repositories';
import { commentsService } from '../services/commentsService';
import { usersRepositories } from '../repositories/users-repositories';

export const createNewCommentByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const post = await postsRepositories.getPostsById(postId);
  if (!post) {
    return res.status(HttpStatusCode.NotFound).send('Post not found');
  }
  if (!req.user?.id) {
    return res.send(HttpStatusCode.Unauthorized);
  }
  const user = await usersRepositories.findUserById(req.user?.id);
  if (!user) {
    return res.status(HttpStatusCode.Unauthorized).send('User not found');
  }
  const newCommentByPostId = await commentsService.createNewCommentByPostId(req.body, user, postId);
  res.status(HttpStatusCode.Created).send({
    id: newCommentByPostId.id,
    content: newCommentByPostId.content,
    commentatorInfo: {
      userId: newCommentByPostId.commentatorInfo.userId,
      userLogin: newCommentByPostId.commentatorInfo.userLogin,
    },
    createdAt: newCommentByPostId.createdAt,
  });
};
