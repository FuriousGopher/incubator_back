import {Router} from "express";
import {createNewPost, deletePostsById, getAllPosts, getPostsById, updatePostById} from "../controllers/postsController";
import {loginValidationRules, validateLogin} from "../midlewares/authorization";
export const postsRouter = Router()

postsRouter.get('/', getAllPosts)
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', loginValidationRules, validateLogin, createNewPost);
postsRouter.delete('/:id', loginValidationRules, validateLogin, deletePostsById);
postsRouter.put('/:id', loginValidationRules, validateLogin,  updatePostById );