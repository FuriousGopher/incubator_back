import { MethodGetAllReqQueryById } from '../types/queryType';
import { postsRepositories } from '../repositories/posts-repositories';
import { PostType } from '../models/postType';
import { GetAllBlogsQueryType } from '../DTO/queryForBlogs';
import { commentsRepositories } from '../repositories/comments-repositories';

export const postsService = {
  async getAllPosts(query: MethodGetAllReqQueryById) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const postsResponse = await postsRepositories.getAllPosts(query.pageNumber, query.pageSize, query.sortBy, sortDirection);
    return {
      pagesCount: postsResponse.totalNumberOfPages,
      page: postsResponse.currentPage,
      pageSize: postsResponse.pageSize,
      totalCount: postsResponse.totalNumberOfPosts,
      items: postsResponse.posts,
    };
  },
  async getPostsById(id: string) {
    return await postsRepositories.getPostsById(id);
  },
  async createNewPost(post: PostType) {
    return await postsRepositories.createNewPost(post);
  },
  async deletePostsById(id: string) {
    return await postsRepositories.deletePostsById(id);
  },
  async updatePostById(id: string, post: PostType) {
    return await postsRepositories.updatePostById(id, post);
  },
  async getAllCommentsByPostId(query: GetAllBlogsQueryType, postId: string) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const blogsResponse = await commentsRepositories.getAllCommentsByPostId(postId, query.pageNumber, query.pageSize, query.sortBy, sortDirection);
    return {
      pageSize: blogsResponse.pageSize,
      pagesCount: blogsResponse.totalNumberOfPages,
      page: +blogsResponse.currentPage,
      totalCount: blogsResponse.totalNumberOfPosts,
      items: blogsResponse.comments,
    };
  },
};
