import {Router} from "express";

import {createNewBlog, deleteBlogById, getAllBlogs, getBlogById, updateBlogById} from "../controllers/blogsController";
export const blogsRouter = Router()

blogsRouter.get('/', getAllBlogs)
blogsRouter.get('/:id', getBlogById);
blogsRouter.post('/', createNewBlog);
blogsRouter.delete('/:id',deleteBlogById );
blogsRouter.put('/:id', updateBlogById );