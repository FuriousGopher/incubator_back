import { blogsRepositories } from '../repositories/blogs-repositories';
import { postsRepositories } from '../repositories/posts-repositories';
import { GetAllBlogsQueryType } from '../DTO/queryForBlogs';
import { BlogDBModel } from '../models/blogType';
import { PostViewModel } from '../models/view/postViewModel';
import { PostDBModel } from '../models/postType';
import { uuid } from 'uuidv4';
import { postsService } from './postsService';

export const blogsService = {
  async getAllBlogs(query: GetAllBlogsQueryType) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const blogsResponse = await blogsRepositories.getAllBlogs(
      query.pageNumber,
      query.pageSize,
      query.sortBy,
      sortDirection,
      query.searchNameTerm,
    );
    return {
      pagesCount: blogsResponse.totalNumberOfPages,
      page: blogsResponse.currentPage,
      pageSize: blogsResponse.pageSize,
      totalCount: blogsResponse.totalNumberOfBlogs,
      items: blogsResponse.blogs,
    };
  },

  async getBlogById(id: string) {
    return await blogsRepositories.getBlogById(id);
  },

  async createNewBlog(blogs: BlogDBModel) {
    return await blogsRepositories.createNewBlog(blogs);
  },

  async deleteBlogById(id: string) {
    return await blogsRepositories.deleteBlogById(id);
  },

  async updateBlogById(id: string, blogs: BlogDBModel) {
    return await blogsRepositories.updateBlogById(id, blogs);
  },

  async getAllPostsByBlogId(query: GetAllBlogsQueryType, blogId: string, userId?: string) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const blogsResponse = await postsRepositories.getPostsByBlogId(
      blogId,
      query.pageNumber,
      query.pageSize,
      query.sortBy,
      sortDirection,
    );
    return {
      pageSize: blogsResponse.pageSize,
      pagesCount: blogsResponse.totalNumberOfPages,
      page: +blogsResponse.currentPage,
      totalCount: blogsResponse.totalNumberOfPosts,
      items: await postsService.mapGetAllPosts(blogsResponse.posts, userId),
    };
  },

  async createNewPostByBlogId(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ): Promise<PostViewModel | null> {
    const newPost = new PostDBModel(
      uuid(),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      new Date().toISOString(),
      { likesCount: 0, dislikesCount: 0, users: [] },
    );

    return await postsRepositories.createNewPost(newPost);
  },
};
