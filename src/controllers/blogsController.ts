import { Request, Response } from 'express';
import { blogsRepositories } from '../repositories/blogs-repositories';
import { HttpStatusCode } from '../types/HTTP-Response';
import { MethodGetAllPostsReqQuery } from '../types/queryType';
import { blogsService } from '../services/blogsService';
import { GetAllBlogsQueryType } from '../DTO/queryForBlogs';

export const getAllBlogs = async (
  req: Request<NonNullable<unknown>, NonNullable<unknown>, NonNullable<unknown>, MethodGetAllPostsReqQuery>,
  res: Response,
) => {
  const query = {
    searchNameTerm: req.query.searchNameTerm ?? null,
    pageSize: Number(req.query.pageSize) || 10,
    pageNumber: Number(req.query.pageNumber) || 1,
    sortBy: req.query.sortBy ?? 'createdAt',
    sortDirection: req.query.sortDirection ?? 'desc',
  };
  const response = await blogsService.getAllBlogs(query);
  if (response.items) {
    res.status(HttpStatusCode.OK).send(response);
  } else {
    res.status(HttpStatusCode.NotFound).send('Blogs not found');
  }
};
export const getBlogById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = await blogsService.getBlogById(id);
  if (blog) {
    res.status(HttpStatusCode.OK).send(blog);
  } else {
    res.status(HttpStatusCode.NotFound).send('Blog not found');
  }
};
export const createNewBlog = async (req: Request, res: Response) => {
  const newBlog = await blogsService.createNewBlog(req.body);
  res.status(201).send(newBlog);
};
export const deleteBlogById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isDeleted = await blogsService.deleteBlogById(id);
  if (isDeleted) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.sendStatus(HttpStatusCode.NotFound);
  }
};
export const updateBlogById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const isUpdated = await blogsService.updateBlogById(id, req.body);
  if (isUpdated) {
    res.sendStatus(HttpStatusCode.NoContent);
  } else {
    res.status(HttpStatusCode.NotFound).send('Blog not found');
  }
};
export const getAllPostsByBlogId = async (
  req: Request<
    {
      blogId: string;
    },
    NonNullable<unknown>,
    NonNullable<unknown>,
    GetAllBlogsQueryType
  >,
  res: Response,
) => {
  const query = {
    searchNameTerm: req.query.searchNameTerm ?? null,
    pageSize: Number(req.query.pageSize) || 10,
    pageNumber: Number(req.query.pageNumber) || 1,
    sortBy: req.query.sortBy ?? 'createdAt',
    sortDirection: req.query.sortDirection ?? 'desc',
  };
  const blogId = req.params.blogId;
  const response = await blogsService.getAllPostsByBlogId(query, blogId);
  if (response.items.length) {
    res.status(HttpStatusCode.OK).send(response);
  } else {
    res.status(HttpStatusCode.NotFound).send('Blogs not found');
  }
};
export const createNewPostByBlogId = async (req: Request, res: Response) => {
  const blogId = req.params.blogId;
  if (!blogId) {
    return res.status(HttpStatusCode.BadRequest).send('Blog Id is incorrect');
  }
  const blog = await blogsRepositories.getBlogById(blogId);
  if (!blog) {
    return res.status(HttpStatusCode.NotFound).send('Blog not found');
  }
  const newPostByBlogId = await blogsService.createNewPostByBlogId(req.body, blogId, blog.name);
  res.status(HttpStatusCode.Created).send(newPostByBlogId);
};
