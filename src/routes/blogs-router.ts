import {Router} from "express";
import {createNewBlog, deleteBlogById, getAllBlogs, getBlogById, updateBlogById} from "../controllers/blogsController";
import {loginValidationRules, validateLogin} from "../middlewares/authorization";
import {validatePostAndPutMethodsForBlogsBody} from "../validators/blogsValidator";

export const blogsRouter = Router()

blogsRouter.get('/', getAllBlogs);
blogsRouter.get('/:id', getBlogById);
blogsRouter.post('/', loginValidationRules, validateLogin, validatePostAndPutMethodsForBlogsBody, createNewBlog);
blogsRouter.delete('/:id', loginValidationRules, validateLogin, deleteBlogById);
blogsRouter.put('/:id', loginValidationRules, validateLogin, validatePostAndPutMethodsForBlogsBody, updateBlogById);