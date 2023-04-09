import {blogs} from "../repositories/blogs-repositories";
import {BlogsType} from "../types/blogsType";








export function blogExists (blogId: string, blogs: BlogsType[]): boolean {
    return blogs.some(blog => blog.id === blogId);
}


console.log(blogExists("4", blogs))
console.log(blogExists("testBlog", blogs))
