import {PostsType} from "../types/postsType";

let posts: PostsType [] = [];


export const postsRepositories = {

    getAllPosts() {
        return posts.length ? posts : undefined;
    },

    getPostsById(id: string): PostsType | undefined {
        return posts.find(post => post.id === id);
    },

    createNewPost(post: PostsType) {
        const newPost = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName
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
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName
            }
            return true
        } else { return false }
    }
}