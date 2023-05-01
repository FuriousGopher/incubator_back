import { Request, Response } from 'express';
import { HttpStatusCode } from '../types/HTTP-Response';
import { postsRepositories } from '../repositories/posts-repositories';
import { commentsService } from '../services/commentsService';
import { usersRepositories } from '../repositories/users-repositories';
import { commentsRepositories } from '../repositories/comments-repositories';

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

export const getCommentById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const comments = await commentsService.getCommentById(id);
  if (comments) {
    res.status(200).send(comments);
  } else {
    res.status(404).send('Comments not found');
  }
};

export const updateCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const comment = await commentsRepositories.getCommentById(commentId);
  if (!comment) {
    return res.status(HttpStatusCode.NotFound).send('Comment not found');
  }
  if (!req.user?.id) {
    return res.send(HttpStatusCode.Unauthorized);
  }
  const userId = await usersRepositories.findUserById(req.user?.id);
  if (!userId) {
    return res.status(HttpStatusCode.Unauthorized).send('User not found');
  }
  const isCommentOwner = await commentsRepositories.checkCommentUserId(commentId, userId);
  if (!isCommentOwner) {
    res.status(HttpStatusCode.Forbidden).send('User is not the owner of the comment');
    return;
  }
  const updated = await commentsService.updateCommentById(req.body, commentId);
  if (updated) {
    res.sendStatus(HttpStatusCode.NoContent);
  }
};

export const deleteCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const comment = await commentsRepositories.getCommentById(commentId);
  if (!comment) {
    return res.status(HttpStatusCode.NotFound).send('Comment not found');
  }
  if (!req.user?.id) {
    return res.send(HttpStatusCode.Unauthorized);
  }
  const userId = await usersRepositories.findUserById(req.user?.id);
  if (!userId) {
    return false;
  }
  const isCommentOwner = await commentsRepositories.checkCommentUserId(commentId, userId);
  if (!isCommentOwner) {
    res.status(HttpStatusCode.Forbidden).send('User is not the owner of the comment');
    return;
  }
  const deleted = await commentsService.deleteCommentById(commentId);
  if (deleted) {
    res.status(HttpStatusCode.NoContent);
  }
};
