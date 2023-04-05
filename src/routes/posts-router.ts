import {Router} from "express";
import {createNewPost, deletePostsById, getAllPosts, getPostsById, updatePostById} from "../controllers/postsController";
export const postsRouter = Router()

postsRouter.get('/', getAllPosts) //// ready
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', createNewPost);
postsRouter.delete('/:id', deletePostsById); //TODO check why doest work ?
postsRouter.put('/:id', updatePostById );