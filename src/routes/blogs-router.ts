import {Router} from "express";
import {createNewBlog, deleteBlogById, getAllBlogs, getBlogById, updateBlogById} from "../controllers/blogsController";
import {loginValidationRules, validateLogin} from "../middlewares/authorization";
import {validatePostAndPutMethodsForBlogsBody} from "../validators/blogsValidator";

export const blogsRouter = Router()

blogsRouter.get('/',   validatePostAndPutMethodsForBlogsBody, getAllBlogs);
blogsRouter.get('/:id',validatePostAndPutMethodsForBlogsBody, getBlogById);
blogsRouter.post('/', loginValidationRules, validateLogin, validatePostAndPutMethodsForBlogsBody, createNewBlog);
blogsRouter.delete('/:id', loginValidationRules, validateLogin, validatePostAndPutMethodsForBlogsBody, deleteBlogById );
blogsRouter.put('/:id', loginValidationRules, validateLogin, validatePostAndPutMethodsForBlogsBody, updateBlogById );