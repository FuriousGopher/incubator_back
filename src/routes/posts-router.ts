import {Router} from "express";
import {createNewPost, deletePostsById, getAllPosts, getPostsById, updatePostById} from "../controllers/postsController";
import {loginValidationRules, validateLogin} from "../middlewares/authorization";
import {validatePostAndPutMethodsForPostsBody} from "../validators/postValidator";
import {validationMiddleware} from "../validators/blogsValidator";
export const postsRouter = Router()

postsRouter.get('/', getAllPosts)
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', loginValidationRules,validatePostAndPutMethodsForPostsBody, validateLogin, validationMiddleware, createNewPost);
postsRouter.delete('/:id', loginValidationRules, validateLogin, deletePostsById);
postsRouter.put('/:id', loginValidationRules,validatePostAndPutMethodsForPostsBody, validateLogin, validationMiddleware, updatePostById );