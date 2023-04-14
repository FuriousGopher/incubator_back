import {BlogsType} from "./blogsType";
import {VideosType} from "./videoTypes";
import {PostsType} from "./postsType";
import {client} from "../repositories/db";

const dbVideos = client.db('videos')
const dbPosts = client.db('posts')
const dbBlogs = client.db('blogs')
export const blogsCollection = dbBlogs.collection<BlogsType>("blogs")
export const videosCollection = dbVideos.collection<VideosType>("videos")
export const postsCollection = dbPosts.collection<PostsType>("posts")

export const collections = [blogsCollection, videosCollection, postsCollection]