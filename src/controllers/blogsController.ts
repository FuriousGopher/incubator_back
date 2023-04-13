import {Request, Response} from 'express'
import {blogsRepositories} from "../repositories/blogs-repositories";
import {HttpStatusCode} from "../types/HTTP-Response";

export const getAllBlogs = async (req: Request, res: Response) => {
    const blogs = await blogsRepositories.getAllBlogs()
    if (blogs) {
        res.status(HttpStatusCode.OK).send(blogs);
    }
} //// ready
export const getBlogById = async (req: Request, res: Response) => {
    let id = req.params.id;
    const blog = await blogsRepositories.getBlogById(id)
    if (blog) {
        res.status(HttpStatusCode.OK).send(blog);
    } else {
        res.status(HttpStatusCode.NotFound).send('Blog not found');
    }
} ////// ready hw3
export const createNewBlog = async (req: Request, res: Response) => {
    const newBlog = await blogsRepositories.createNewBlog(req.body)
    res.status(201).send(newBlog)
} //// ready
export const deleteBlogById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = await blogsRepositories.deleteBlogById(id)
    if (isDeleted){
    res.sendStatus(HttpStatusCode.NoContent);
} else {
    res.sendStatus(HttpStatusCode.NotFound);
}
} ///// ready
export const updateBlogById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const isUpdated = await blogsRepositories.updateBlogById(id, req.body)
    if (isUpdated){
        res.sendStatus(HttpStatusCode.NoContent);
    } else {
        res.status(HttpStatusCode.NotFound).send('Blog not found');
    }
} ///// ready
