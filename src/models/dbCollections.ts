import { BlogsType } from './blogsType';
import { VideosType } from './videoTypes';
import { PostsType } from './postsType';
import { client } from '../repositories/db';
import { UserModel } from '../types/userType';
import { CommentType } from './commentType';

export const dbVideos = client.db('videos');
export const dbPosts = client.db('posts');
export const dbBlogs = client.db('blogs');
export const dbUsers = client.db('users');
export const dbComment = client.db('comment');
export const blogsCollection = dbBlogs.collection<BlogsType>('blogs');
export const videosCollection = dbVideos.collection<VideosType>('videos');
export const postsCollection = dbPosts.collection<PostsType>('posts');
export const commentCollection = dbComment.collection<CommentType>('comment');
export const usersCollection = dbUsers.collection<UserModel>('users');
export const collections = [blogsCollection, videosCollection, postsCollection, usersCollection, commentCollection];
