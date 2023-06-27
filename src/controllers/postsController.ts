import { Request, Response } from 'express';
import { HttpStatusCode } from '../types/HTTP-Response';
import { postsService } from '../services/postsService';

export const getAllPosts = async (
  req: Request<{ blogId: string }, any, any, { [key: string]: string }>,
  res: Response,
) => {
  const query = {
    pageSize: Number(req.query.pageSize) || 10,
    pageNumber: Number(req.query.pageNumber) || 1,
    sortBy: req.query.sortBy ?? 'createdAt',
    sortDirection: req.query.sortDirection ?? 'desc',
  };
  const userId = req.user!.id;
  const response = await postsService.getAllPosts(query, userId);
  if (response.items) {
    res.status(HttpStatusCode.OK).send(response);
  } else {
    res.status(HttpStatusCode.NotFound).send('Posts not found');
  }
};
export const getPostsById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;
  const foundPost = await postsService.getPostsById(id, userId);
  if (foundPost) {
    res.status(200).send(foundPost);
  } else {
    res.status(404).send('Post not found');
  }
};
export const createNewPost = async (req: Request, res: Response) => {
  const newPost = await postsService.createNewPost(
    req.body.title,
    req.body.shortDescription,
    req.body.content,
    req.body.blogId,
  );
  res.status(201).send(newPost);
};
export const deletePostsById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted = await postsService.deletePostsById(id);
  if (isDeleted) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
};
export const updatePostById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isUpdated = await postsService.updatePostById(id, req.body);
  if (isUpdated) {
    res.sendStatus(204);
  } else {
    res.status(404).send('Post not found');
  }
};

export const getAllCommentsByPostId = async (
  req: Request<
    {
      postId: string;
    },
    NonNullable<unknown>,
    NonNullable<unknown>,
    { [key: string]: string }
  >,
  res: Response,
) => {
  const userId = req.user?.id;
  const query = {
    searchNameTerm: req.query.searchNameTerm ?? null,
    pageSize: Number(req.query.pageSize) || 10,
    pageNumber: Number(req.query.pageNumber) || 1,
    sortBy: req.query.sortBy ?? 'createdAt',
    sortDirection: req.query.sortDirection ?? 'desc',
  };
  const postId = req.params.postId;
  const response = await postsService.getAllCommentsByPostId(query, postId, userId);
  if (response.items.length) {
    res.status(HttpStatusCode.OK).send(response);
  } else {
    res.status(HttpStatusCode.NotFound).send('Post not found');
  }
};

export const updateLikeStatusForPost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user!.id;
  const likeStatus = req.body.likeStatus;
  const updateLikeStatusByPostId = await postsService.updateLikeStatus(id, userId, likeStatus);
  if (updateLikeStatusByPostId) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.status(HttpStatusCode.NotFound).send('Comments not found');
  }
};
