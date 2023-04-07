import {Request, Response} from 'express'
import {validatePostAndPutMethodsForPostsBody} from "../validators/postValidator";
import {postsRepositories} from "../repositories/posts-repositories";


export const getAllPosts = (req: Request, res: Response) => {
    const posts = postsRepositories.getAllPosts()
    if (posts){
        res.status(200).send(posts)
    } else {
    res.status(404).send('Posts not found')}
} //// ready
export const getPostsById = (req: Request, res: Response) => {
    let id = req.params.id;
    const post = postsRepositories.getPostsById(id)
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
    const newPost = postsRepositories.createNewPost(req.body)

    res.status(201).send(newPost)


} //// check where we take id and blogName? ready
export const deletePostsById = (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = postsRepositories.deletePostsById(id)
    if (isDeleted){
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
} //// ready
export const updatePostById = (req: Request, res: Response) => {
    const id = req.params.id;
    const errors = validatePostAndPutMethodsForPostsBody(req.body)
    if (errors?.errorsMessages) {
        res.status(400).send(errors)
        return;
    }
    const isUpdated = postsRepositories.updatePostById(id, req.body)
    if (isUpdated){
        res.sendStatus(204);
    } else {
        res.status(404).send('Post not found');
    }
} /// ready
