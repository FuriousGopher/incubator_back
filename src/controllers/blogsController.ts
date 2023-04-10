import {Request, Response} from 'express'
import {blogsRepositories} from "../repositories/blogs-repositories";

export const getAllBlogs = (req: Request, res: Response) => {
    const blogs = blogsRepositories.getAllBlogs()
    if (blogs) {
        res.status(200).send(blogs);
    }
} //// ready
export const getBlogById = (req: Request, res: Response) => {
    let id = req.params.id;
    const blog = blogsRepositories.getBlogById(id)
    if (blog) {
        res.status(200).send(blog);
    } else {
        res.status(404).send('Blog not found');
    }
} ////// ready
export const createNewBlog = (req: Request, res: Response) => {
    const newBlog = blogsRepositories.createNewBlog(req.body)
    res.status(201).send(newBlog)
} //// ready
export const deleteBlogById = (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = blogsRepositories.deleteBlogById(id)
    if (isDeleted){
    res.sendStatus(204);
} else {
    res.sendStatus(404);
}
} ///// ready
export const updateBlogById = (req: Request, res: Response) => {
    const id = req.params.id;
    const isUpdated =  blogsRepositories.updateBlogById(id, req.body)
    if (isUpdated){
        res.sendStatus(204);
    } else {
        res.status(404).send('Blog not found');
    }
} ///// ready
