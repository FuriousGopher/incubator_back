import {Router} from "express";
import {createNewPost, deletePostsById, getAllPosts, getPostsById, updatePostById} from "../controllers/postsController";
import {loginValidationRules, validateLogin} from "../middlewares/authorization";
import {validatePostAndPutMethodsForPostsBody} from "../validators/postValidator";
import {validationMiddleware} from "../validators/blogsValidator";
export const postsRouter = Router()

postsRouter.get('/', getAllPosts)
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', validatePostAndPutMethodsForPostsBody,validateLogin, loginValidationRules, validationMiddleware, createNewPost);
postsRouter.delete('/:id', loginValidationRules, deletePostsById);
postsRouter.put('/:id', validatePostAndPutMethodsForPostsBody,validateLogin, loginValidationRules, validationMiddleware, updatePostById );