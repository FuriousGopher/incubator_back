import {Request, Response} from 'express'
import {BlogsType} from "../types/blogsType";
import {validatePostAndPutMethodsForBlogsBody} from "../validators/blogsValidator";
import {validatePostAndPutMethodsForPostsBody} from "../validators/postValidator";

let blogs: BlogsType [] = []

export const getAllBlogs = (req: Request, res: Response) => {
    res.status(200).send(blogs)
} //// ready

export const getBlogById = (req: Request, res: Response) => {
    let id = req.params.id;
    const blog = blogs.find(blog => blog.id === id);
    if (blog) {
        res.status(200).send(blog);
    } else {
        res.status(404).send('Blog not found');
    }
} ////// ready

export const createNewBlog = (req: Request, res: Response) => {
    const errors = validatePostAndPutMethodsForBlogsBody(req.body)
    if (errors?.errorsMessages) {
        res.status(400).send(errors)
        return;
    }
    const newBlog = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    };
    blogs.push(newBlog)
    res.status(201).send(newBlog)
} //// check where we take id and blogName?

export const deleteBlogById = (req: Request, res: Response) => {
    const id = req.params.id;
    const index = blogs.findIndex(blog => blog.id === id);
    if (index !== -1) {
        blogs.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
} ///// ready
export const updateBlogById = (req: Request, res: Response) => {
    const id = req.params.id;
    const blogIndex = blogs.findIndex(blog => blog.id === id);
    const errors = validatePostAndPutMethodsForBlogsBody(req.body)
    if (errors?.errorsMessages) {
        res.status(400).send(errors)
        return;
    }
    if (blogIndex >= 0) {
        blogs[blogIndex] = {
            id,
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
        };
        res.sendStatus(204);
    } else {
        res.status(404).send('Blog not found');
    }
} ///// ready
