import {Router} from "express";
import {createNewBlog, deleteBlogById, getAllBlogs, getBlogById, updateBlogById} from "../controllers/blogsController";
import {loginValidationRules} from "../middlewares/authorization";
import {validatePostAndPutMethodsForBlogsBody, validationMiddleware} from "../validators/blogsValidator";

export const blogsRouter = Router()

blogsRouter.get('/', getAllBlogs);
blogsRouter.get('/:id', getBlogById);
blogsRouter.post('/', loginValidationRules, validatePostAndPutMethodsForBlogsBody, validationMiddleware, createNewBlog);
blogsRouter.delete('/:id', loginValidationRules, deleteBlogById);
blogsRouter.put('/:id', loginValidationRules, validatePostAndPutMethodsForBlogsBody, validationMiddleware, updateBlogById);