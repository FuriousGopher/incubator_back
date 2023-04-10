import {PostsType} from "../types/postsType";
import {uuid} from "uuidv4";
import {blogs} from "./blogs-repositories";
import express from "express";


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
       // const blog = blogs.find(blog => blog.name === post.blogName);//
        const newPost = {
            id: uuid(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
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
                blogId: post.id,
                blogName: posts[postIndex].blogName
            }
            return true
        } else { return false }
    }
}