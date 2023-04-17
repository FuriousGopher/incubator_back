import {BlogsType} from "../models/blogsType";
import {uuid} from 'uuidv4';
import {WithId} from "mongodb";
import {blogsCollection, postsCollection} from "../models/dbCollections";
import {PostsType} from "../models/postsType";


export const blogsRepositories = {

    async getBlogById(id: string): Promise<WithId<BlogsType> | null> {
        return blogsCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async getAllBlogs(pageNumber: number, nPerPage: number, sortBy: string, sortDirection: 1 | -1, searchNameTerm: string | null) {
        let filter = {}
        if (searchNameTerm) {
            const regex = new RegExp(searchNameTerm, 'i');
            filter = {"name": {$regex: regex}}
        }
        return blogsCollection.find(filter).sort({[sortBy]: sortDirection}).skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0).limit(nPerPage).project({_id: false}).toArray();
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
    },

    async createNewPostByBlogId(post: PostsType, blogId: string, blogName: string) {
        const newPost = {
            id: uuid(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        };

        await postsCollection.insertOne({...newPost})
        return newPost
    },
}