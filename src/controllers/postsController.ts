import { Request, Response } from 'express';
import { MethodGetAllReqQueryById, QueryForRequest } from '../types/queryType';
import { HttpStatusCode } from '../types/HTTP-Response';
import { postsService } from '../services/postsService';
import { GetAllBlogsQueryType } from '../DTO/queryForBlogs';
import { jwtService } from '../aplication/jwt-service';
import { UsersService } from '../services/usersService';
import { container } from '../composition-root';

const usersService = container.resolve(UsersService);

export const getAllPosts = async (req: QueryForRequest<MethodGetAllReqQueryById>, res: Response) => {
  const query = {
    pageSize: Number(req.query.pageSize) || 10,
    pageNumber: Number(req.query.pageNumber) || 1,
    sortBy: req.query.sortBy ?? 'createdAt',
    sortDirection: req.query.sortDirection ?? 'desc',
  };
  const cookieRefreshToken = req.cookies.refreshToken;
  const userId = await jwtService.getUserIdByToken(cookieRefreshToken);
  const userIdString = userId?.toString();
  const response = await postsService.getAllPosts(query, userIdString);
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
