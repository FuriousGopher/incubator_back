import {BlogsType} from "../types/blogsType";

const blogs = []  as BlogsType[]

export const blogsRepositories = {

    getBlogById(id: string): BlogsType | undefined {
        return blogs.find(blog => blog.id === id);
    },

    getAllBlogs() {
        return blogs.length ? blogs : undefined;
    },

    createNewBlog(blog: BlogsType) {
        const newBlog = {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        };
        blogs.push(newBlog)
        return newBlog
    },

    deleteBlogById(id: string) {
        const index = blogs.findIndex(blog => blog.id === id);
        if (index !== -1) {
            blogs.splice(index, 1);
            return true
        }
        return false
    },

    updateBlogById(id: string, blog: BlogsType) {
        const blogIndex = blogs.findIndex(blog => blog.id === id);
        if (blogIndex >= 0) {
            blogs[blogIndex] = {
                id: blog.id,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl
            }
         return true
        } else { return false }
    }
}