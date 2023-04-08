import {Router} from "express";

import {createNewBlog, deleteBlogById, getAllBlogs, getBlogById, updateBlogById} from "../controllers/blogsController";
import {loginValidationRules, validateLogin} from "../midlewares/authorization";

export const blogsRouter = Router()

blogsRouter.get('/',   getAllBlogs);
blogsRouter.get('/:id', getBlogById);
blogsRouter.post('/', loginValidationRules, validateLogin, createNewBlog);
blogsRouter.delete('/:id', loginValidationRules, validateLogin, deleteBlogById );
blogsRouter.put('/:id', loginValidationRules, validateLogin, updateBlogById );