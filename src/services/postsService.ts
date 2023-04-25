import { MethodGetAllReqQueryById } from '../types/queryType';
import { postsRepositories } from '../repositories/posts-repositories';
import { PostsType } from '../models/postsType';

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
  async createNewPost(post: PostsType) {
    return await postsRepositories.createNewPost(post);
  },
  async deletePostsById(id: string) {
    return await postsRepositories.deletePostsById(id);
  },
  async updatePostById(id: string, post: PostsType) {
    return await postsRepositories.updatePostById(id, post);
  },
};
