import {Router} from "express";
import {createNewPost, deletePostsById, getAllPosts, getPostsById, updatePostById} from "../controllers/postsController";
import {loginValidationRules, validateLogin} from "../middlewares/authorization";
import {validatePostAndPutMethodsForPostsBody} from "../validators/postValidator";
export const postsRouter = Router()

postsRouter.get('/', getAllPosts)
postsRouter.get('/:id', getPostsById);
postsRouter.post('/', loginValidationRules,validatePostAndPutMethodsForPostsBody, validateLogin, createNewPost);
postsRouter.delete('/:id', loginValidationRules,validatePostAndPutMethodsForPostsBody, validateLogin, deletePostsById);
postsRouter.put('/:id', loginValidationRules,validatePostAndPutMethodsForPostsBody, validateLogin,  updatePostById );