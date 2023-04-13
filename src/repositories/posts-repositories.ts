import {PostsType} from "../models/postsType";
import {uuid} from "uuidv4";
import {blogs} from "./blogs-repositories";


export let posts: PostsType [] = [{
    id: "testPost",
    title: "testTittlePost",
    shortDescription: "testShortDescription",
    content: "testContent",
    blogId: "testBlogId",
    blogName: "testBlogName"
}];


export const postsRepositories = {

    async getAllPosts() {
        return posts;
    },

    async getPostsById(id: string): Promise<PostsType | undefined> {
        return posts.find(post => post.id === id);
    },
    async createNewPost(post: PostsType) {

        const blog = blogs.find((blog) => blog.id === post.blogId);
        if (!blog) {
            return false
        }

        const newPost = {
            id: uuid(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blog.name,
        };

        posts.push(newPost)
        return newPost
    },

    async deletePostsById(id: string) {
        const index = posts.findIndex(post => post.id === id);
        if (index !== -1) {
            posts.splice(index, 1);
            return true
        }
        return false
    },

    async updatePostById(id: string, post: PostsType) {
        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex >= 0) {
            posts[postIndex] = {
                id: posts[postIndex].id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: posts[postIndex].blogName
            }
            return true
        } else {
            return false
        }
    }
}