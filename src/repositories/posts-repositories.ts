import {PostsType} from "../types/postsType";
import {blogs} from "./blogs-repositories";
import {uuid} from "uuidv4";

export let posts: PostsType [] = [{
    id: "testPost",
    title: "testTittlePost",
    shortDescription: "testShortDescription",
    content: "testContent",
    blogId: "testBlogId",
    blogName: "testBlogName"
}];


export const postsRepositories = {

    getAllPosts() {
        return posts.length ? posts : undefined;
    },

    getPostsById(id: string): PostsType | undefined {
        return posts.find(post => post.id === id);
    },

    createNewPost(post: PostsType) {
        const foundBlog  = blogs.find(blog => blog.id === post.blogId);
        if (!foundBlog) return
        const newPost = {
            id: uuid(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: foundBlog.id,
            blogName: foundBlog.name,
        };

        posts.push(newPost)
        return newPost
    },

    deletePostsById(id: string) {
        const index = posts.findIndex(post => post.id === id);
        if (index !== -1) {
            posts.splice(index, 1);
            return true
        }
        return false
    },

    updatePostById(id: string, post: PostsType) {
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
        } else { return false }
    }
}