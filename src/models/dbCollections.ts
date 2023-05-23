import { BlogType } from './blogType';
import { VideosType } from './videoTypes';
import { PostType } from './postType';
import { client } from '../repositories/db';
import { UserAccountDBType, UserModel } from './userType';
import { CommentType } from './commentType';
import { LogsType } from './logsType';
import { DevicesType } from './DevicesType';

export const dbVideos = client.db('videos');
export const dbPosts = client.db('posts');
export const dbBlogs = client.db('blogs');
export const dbUsers = client.db('users');
export const dbComment = client.db('comment');
export const dbAccounts = client.db('accounts');
export const dbDevices = client.db('devices');
export const dbLogs = client.db('logs');

export const blogsCollection = dbBlogs.collection<BlogType>('blogs');
export const videosCollection = dbVideos.collection<VideosType>('videos');
export const postsCollection = dbPosts.collection<PostType>('posts');
export const commentCollection = dbComment.collection<CommentType>('comment');
export const usersCollection = dbUsers.collection<UserModel>('users');
export const usersAccountsCollection = dbAccounts.collection<UserAccountDBType>('accounts');
export const userDevicesCollection = dbDevices.collection<DevicesType>('devices');
export const logCollection = dbLogs.collection<LogsType>('logs');

export const collections = [
  blogsCollection,
  videosCollection,
  postsCollection,
  commentCollection,
  usersAccountsCollection,
  usersCollection,
  userDevicesCollection,
  logCollection,
];
