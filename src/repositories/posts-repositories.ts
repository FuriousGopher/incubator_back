import {PostsType} from "../models/postsType";
import {uuid} from "uuidv4";
import {blogsCollection, postsCollection} from "../models/dbCollections";
import {WithId} from "mongodb";


export const postsRepositories = {

    async getAllPosts() {
        return postsCollection.find().project({_id: false}).toArray();
    },

    async getPostsById(id: string): Promise<WithId<PostsType> | null> {
        return postsCollection.findOne({id: id}, {projection: {_id: 0}});
    },

    async createNewPost(post: PostsType) {

        const blog = await blogsCollection.findOne({id: post.blogId});
        if (!blog) {
            return false;
        }

        const newPost = {
            id: uuid(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        };

        await postsCollection.insertOne({...newPost})
        return newPost
    },

    async deletePostsById(id: string) {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },

    async updatePostById(id: string, post: PostsType) {
        const result = await postsCollection.updateOne({id: id},
            {
                $set: {
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                }
            });
        return result.matchedCount === 1;
    },

    async getPostsByBlogId(blogId: string) {
        return  await postsCollection.find({ blogId: blogId }).toArray()

    }

}