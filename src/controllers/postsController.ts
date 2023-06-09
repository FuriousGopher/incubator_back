import { Request, Response } from 'express';
import { MethodGetAllReqQueryById } from '../types/queryType';
import { HttpStatusCode } from '../types/HTTP-Response';
import { postsService } from '../services/postsService';
import { GetAllBlogsQueryType } from '../DTO/queryForBlogs';
import { jwtService } from '../aplication/jwt-service';
import { usersService } from '../services/usersService';

export const getAllPosts = async (
  req: Request<NonNullable<unknown>, NonNullable<unknown>, NonNullable<unknown>, MethodGetAllReqQueryById>,
  res: Response,
) => {
  const query = {
    pageSize: Number(req.query.pageSize) || 10,
    pageNumber: Number(req.query.pageNumber) || 1,
    sortBy: req.query.sortBy ?? 'createdAt',
    sortDirection: req.query.sortDirection ?? 'desc',
  };
  const response = await postsService.getAllPosts(query);
  if (response.items) {
    res.status(HttpStatusCode.OK).send(response);
  } else {
    res.status(HttpStatusCode.NotFound).send('Posts not found');
  }
};
export const getPostsById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const post = await postsService.getPostsById(id);
  if (post) {
    res.status(200).send(post);
  } else {
    res.status(404).send('Post not found');
  }
};
export const createNewPost = async (req: Request, res: Response) => {
  const newPost = await postsService.createNewPost(req.body);
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
    GetAllBlogsQueryType
  >,
  res: Response,
) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (accessToken) {
    const userId = await jwtService.getUserIdByToken(accessToken);
    const userModel = await usersService.findUserById(userId?.userId.toString());
    req.user = { id: userModel?.id };
  }
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
