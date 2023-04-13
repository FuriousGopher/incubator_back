import {BlogsType} from "../models/blogsType";
import {uuid} from 'uuidv4';
import {FindCursor, WithId} from "mongodb";
import {client} from "./db";

export const __blogs = [{
    id: "testBlog",
    name: "testNameBlog",
    description: "testDescriptionBlog",
    websiteUrl: "https://www.youtube.com",
}] as BlogsType[]

export const blogsRepositories = {

    async getBlogById(id: string): Promise<FindCursor<WithId<BlogsType>>> {
        return client.db("blogs").collection<BlogsType>("blog").find({id: id}) /////// work ?
    },

    async getAllBlogs() {
        return __blogs
    },

    async createNewBlog(blog: BlogsType) {
        const newBlog = {
            id: uuid(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        };
        await client.db("blogs").collection<BlogsType>("blog").insertOne(newBlog)
        __blogs.push(newBlog)
        return newBlog
    },

    async deleteBlogById(id: string) {
        const index = __blogs.findIndex(blog => blog.id === id);
        if (index !== -1) {
            __blogs.splice(index, 1);
            return true
        }
        return false
    },

    async updateBlogById(id: string, blog: BlogsType) {
        const blogIndex =  __blogs.findIndex(blog => blog.id === id);
        if (blogIndex >= 0) {
            __blogs[blogIndex] = {
                id: __blogs[blogIndex].id,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl
            }
            return true
        } else {
            return false
        }
    }
}