import { Request, Response } from 'express';
import { HttpStatusCode } from '../types/HTTP-Response';
import { commentsService } from '../services/commentsService';
import { usersService } from '../services/usersService';
import { commentsRepositories } from '../repositories/comments-repositories';

export const createNewCommentByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  if (!req.user?.id) {
    return res.send(HttpStatusCode.Unauthorized);
  }
  try {
    const newCommentByPostId = await commentsService.createNewCommentByPostId(req.body, req.user.id, postId);
    res.status(HttpStatusCode.Created).send({
      id: newCommentByPostId.id,
      content: newCommentByPostId.content,
      commentatorInfo: {
        userId: newCommentByPostId.commentatorInfo.userId,
        userLogin: newCommentByPostId.commentatorInfo.userLogin,
      },
      createdAt: newCommentByPostId.createdAt,
      likesInfo: {
        likesCount: newCommentByPostId.likesInfo.likesCount,
        dislikesCount: newCommentByPostId.likesInfo.dislikesCount,
        myStatus: newCommentByPostId.likesInfo.myStatus,
      },
    });
  } catch (e: any) {
    return res.status(e.statusCode).send(e.message);
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const comment = await commentsService.getCommentById(id);
  if (comment) {
    res.status(200).send(comment);
  } else {
    res.status(404).send('Comments not found');
  }
};

export const updateCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const comment = await commentsService.getCommentById(commentId);
  if (!comment) {
    return res.status(HttpStatusCode.NotFound).send('Comment not found');
  }
  if (!req.user?.id) {
    return res.send(HttpStatusCode.Unauthorized);
  }
  const user = await usersService.findUserById(req.user?.id);
  if (!user) {
    return res.status(HttpStatusCode.Unauthorized).send('User not found');
  }
  const isCommentOwner = await commentsService.checkCommentUserId(commentId, user.id);
  if (!isCommentOwner) {
    res.status(HttpStatusCode.Forbidden).send('User is not the owner of the comment');
    return;
  }
  const updated = await commentsService.updateCommentById(req.body, commentId);
  if (updated) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.sendStatus(HttpStatusCode.InternalServerError);
  }
};

export const deleteCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const comment = await commentsService.getCommentById(commentId);
  if (!comment) {
    return res.status(HttpStatusCode.NotFound).send('Comment not found');
  }
  if (!req.user?.id) {
    return res.status(HttpStatusCode.Unauthorized).send('User Id not found');
  }
  const user = await usersService.findUserById(req.user?.id);
  if (!user) {
    return res.status(HttpStatusCode.Unauthorized).send('User not found');
  }
  const isCommentOwner = await commentsService.checkCommentUserId(commentId, user.id);
  if (!isCommentOwner) {
    return res.status(HttpStatusCode.Forbidden).send('User is not the owner of the comment');
  }
  const deleted = await commentsService.deleteCommentById(commentId);
  if (deleted) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.sendStatus(HttpStatusCode.InternalServerError);
  }
};

export const updateLikeStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user!.id;
  const likeStatus = req.body.likeStatus;
  const updateLikeStatusByCommentId = await commentsService.updateLikeStatus(id, userId, likeStatus);
  if (updateLikeStatusByCommentId) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.status(HttpStatusCode.NotFound).send('Comments not found');
  }
};
