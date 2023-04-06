import {Router} from "express";
import {createNewPost, deletePostsById, getAllPosts, getPostsById, updatePostById} from "../controllers/postsController";
export const postsRouter = Router()

postsRouter.get('/', getAllPosts)
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', createNewPost);
postsRouter.delete('/:id', deletePostsById);
postsRouter.put('/:id', updatePostById );