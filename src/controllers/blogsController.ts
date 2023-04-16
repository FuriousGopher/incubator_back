import {Request, Response} from 'express'
import {blogsRepositories} from "../repositories/blogs-repositories";
import {HttpStatusCode} from "../types/HTTP-Response";
import {postsRepositories} from "../repositories/posts-repositories";

type GetAllBlogsReqQuery = {
    searchNameTerm: string;
    sortBy: string;
    sortDirection: string;
    pageNumber: number;
    pageSize: number;
}
export const getAllBlogs = async (req: Request<{}, {}, {}, GetAllBlogsReqQuery>, res: Response) => {
    const query: GetAllBlogsReqQuery = {
        searchNameTerm: req.query.searchNameTerm ?? null,
        pageSize: req.query.pageSize ?? 10,
        pageNumber: req.query.pageNumber ?? 1,
        sortBy: req.query.sortBy ?? "createdAt",
        sortDirection: req.query.sortDirection ?? "desc"
    }
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const blogs = await blogsRepositories.getAllBlogs(query.pageNumber, query.pageSize, query.sortBy, sortDirection, query.searchNameTerm)
    if (blogs) {
        res.status(HttpStatusCode.OK).send(blogs);
    }
}
export const getBlogById = async (req: Request, res: Response) => {
    let id = req.params.id;
    const blog = await blogsRepositories.getBlogById(id)
    if (blog) {
        res.status(HttpStatusCode.OK).send(blog);
    } else {
        res.status(HttpStatusCode.NotFound).send('Blog not found');
    }
}
export const createNewBlog = async (req: Request, res: Response) => {
    const newBlog = await blogsRepositories.createNewBlog(req.body)
    res.status(201).send(newBlog)
}
export const deleteBlogById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = await blogsRepositories.deleteBlogById(id)
    if (isDeleted) {
        res.sendStatus(HttpStatusCode.NoContent);
    } else {
        res.sendStatus(HttpStatusCode.NotFound);
    }
}
export const updateBlogById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const isUpdated = await blogsRepositories.updateBlogById(id, req.body)
    if (isUpdated) {
        res.sendStatus(HttpStatusCode.NoContent);
    } else {
        res.status(HttpStatusCode.NotFound).send('Blog not found');
    }
}
export const getAllPostsByBlogId = async (req: Request, res: Response) => {
    const blogId = req.params.blogId;
    const posts = await postsRepositories.getPostsByBlogId(blogId);
    if (posts) {
        res.status(HttpStatusCode.OK).send(posts);
    } else {
        res.status(HttpStatusCode.NotFound).send('Posts not found');
    }
};


