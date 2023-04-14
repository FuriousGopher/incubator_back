import {BlogsType} from "../models/blogsType";
import {uuid} from 'uuidv4';
import {WithId} from "mongodb";
import {blogsCollection} from "../models/dbCollections";

export const __blogs = [{
    id: "testBlog",
    name: "testNameBlog",
    description: "testDescriptionBlog",
    websiteUrl: "https://www.youtube.com",
}] as BlogsType[]

export const blogsRepositories = {

    async getBlogById(id: string): Promise<WithId<BlogsType> | null> {
        return blogsCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async getAllBlogs() {
        return blogsCollection.find({}).project({_id: false}).toArray();
    },

    async createNewBlog(blog: BlogsType) {
        const newBlog = {
            id: uuid(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        await blogsCollection.insertOne({...newBlog})
        return newBlog
    },

    async deleteBlogById(id: string) {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },

    async updateBlogById(id: string, blog: BlogsType) {
        const result = await blogsCollection.updateOne({id: id},
            {
                $set: {
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl
                }
            })
        return result.matchedCount === 1
    }
}