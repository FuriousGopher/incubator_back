import {Request, Response} from 'express'
import {postsRepositories} from "../repositories/posts-repositories";
import {MethodGetAllReqQueryAll, MethodGetAllReqQueryById} from "../types/queryRepo";



export const getAllPosts = async (req: Request<{}, {}, {}, MethodGetAllReqQueryAll>, res: Response) => {
    const query: MethodGetAllReqQueryById = {
        pageSize: req.query.pageSize ?? 10,
        pageNumber: req.query.pageNumber ?? 1,
        sortBy: req.query.sortBy ?? "createdAt",
        sortDirection: req.query.sortDirection ?? "desc"
    }
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const posts = await postsRepositories.getAllPosts(query.pageNumber, query.pageSize, query.sortBy, sortDirection)
    if (posts){
        res.status(200).send(posts)
    } else {
    res.status(404).send('Posts not found')}
} //// ready
export const getPostsById = async (req: Request, res: Response) => {
    let id = req.params.id;
    const post = await postsRepositories.getPostsById(id)
    if (post) {
        res.status(200).send(post);
    } else {
        res.status(404).send('Post not found');
    }
} ////// ready
export const createNewPost = async (req: Request, res: Response) => {
    const newPost = await postsRepositories.createNewPost(req.body)
    res.status(201).send(newPost)
}  ////// ready
export const deletePostsById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const isDeleted = await postsRepositories.deletePostsById(id)
    if (isDeleted){
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
} //// ready
export const updatePostById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const isUpdated = await postsRepositories.updatePostById(id, req.body)
    if (isUpdated){
        res.sendStatus(204);
    } else {
        res.status(404).send('Post not found');
    }
}  ////// ready
