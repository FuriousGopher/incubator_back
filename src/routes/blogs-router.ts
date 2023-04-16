import {Router} from "express";
import {
    createNewBlog,
    deleteBlogById,
    getAllBlogs,
    getAllPostsByBlogId,
    getBlogById,
    updateBlogById
} from "../controllers/blogsController";
import {blogIdQueryValidation, validatePostAndPutMethodsForBlogsBody} from "../validators/blogsValidator";
import {checkAuthorization} from "../middlewares/checkAuthorization";
import {validationMiddleware} from "../middlewares/ValidationErorrsMiddleware";

export const blogsRouter = Router()

blogsRouter.get('/', getAllBlogs);
blogsRouter.get('/:blogId/posts', blogIdQueryValidation, getAllPostsByBlogId); /// why not work ?
// blogsRouter.get('/blogs/:blogId/posts', blogIdQueryValidation,  );
blogsRouter.get('/:id', getBlogById);
blogsRouter.post('/', checkAuthorization, validatePostAndPutMethodsForBlogsBody, validationMiddleware, createNewBlog);
blogsRouter.delete('/:id', checkAuthorization, deleteBlogById);
blogsRouter.put('/:id', checkAuthorization, validatePostAndPutMethodsForBlogsBody, validationMiddleware, updateBlogById);