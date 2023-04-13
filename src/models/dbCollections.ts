import {BlogsType} from "./blogsType";
import {VideosType} from "./videoTypes";
import {PostsType} from "./postsType";
import {client} from "../repositories/db";

const dbVideos = client.db('videos')
const dbPosts = client.db('posts')
const dbBlogs = client.db('blogs')
export const blogsCollection = dbBlogs.collection<BlogsType>("blogs")
export const videosCollection = dbBlogs.collection<VideosType>("videos")
export const postsCollection = dbBlogs.collection<PostsType>("posts")