import {Request, Response} from 'express'
import {validatePostAndPutMethodsForPostsBody} from "../validators/postValidator";
import {PostsType} from "../types/postsType";

let posts: PostsType [] = [];

export const getAllPosts = (req: Request, res: Response) => {
    res.status(200).send(posts)
} //// ready

export const getPostsById = (req: Request, res: Response) => {
    let id = req.params.id;
    const post = posts.find(post => post.id === id);
    if (post) {
        res.status(200).send(post);
    } else {
        res.status(404).send('Post not found');
    }
} ////// ready

export const createNewPost = (req: Request, res: Response) => {
    const errors = validatePostAndPutMethodsForPostsBody(req.body)
    if (errors?.errorsMessages) {
        res.status(400).send(errors)
        return;
    }
    const newPost = {
        id: req.body.id,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: req.body.blogNmae,
    };
    // @ts-ignore
    posts.push(newPost)
    res.status(201).send(newPost)


} //// check where we take id and blogName? ready

export const deletePostsById = (req: Request, res: Response) => {
    const id = req.params.id;
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
        posts.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
} //// ready
export const updatePostById = (req: Request, res: Response) => {
    const id = req.params.id;
    const postIndex = posts.findIndex(post => post.id === id);
    const errors = validatePostAndPutMethodsForPostsBody(req.body)
    if (errors?.errorsMessages) {
        res.status(400).send(errors)
        return;
    }
    if (postIndex >= 0) {
        posts[postIndex] = {
            id,
            shortDescription: req.body.shortDescription,
            title: req.body.title,
            content: req.body.content,
            blogId: req.body.blogId,
        };
        res.sendStatus(204);
    } else {
        res.status(404).send('Posts not found');
    }
} /// ready
