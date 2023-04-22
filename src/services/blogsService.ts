import { blogsRepositories } from '../repositories/blogs-repositories';
import { postsRepositories } from '../repositories/posts-repositories';
import { GetAllBlogsQueryType } from '../DTO/queryForBlogs';
import { BlogsType } from '../models/blogsType';
import { PostsType } from '../models/postsType';

export const blogsService = {
  async getAllBlogs(query: GetAllBlogsQueryType) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const blogsResponse = await blogsRepositories.getAllBlogs(query.pageNumber, query.pageSize, query.sortBy, sortDirection, query.searchNameTerm);
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
  async createNewBlog(blogs: BlogsType) {
    return await blogsRepositories.createNewBlog(blogs);
  },
  async deleteBlogById(id: string) {
    return await blogsRepositories.deleteBlogById(id);
  },
  async updateBlogById(id: string, blogs: BlogsType) {
    return await blogsRepositories.updateBlogById(id, blogs);
  },
  async getAllPostsByBlogId(query: GetAllBlogsQueryType, blogId: string) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const blogsResponse = await postsRepositories.getPostsByBlogId(blogId, query.pageNumber, query.pageSize, query.sortBy, sortDirection);
    return {
      pageSize: blogsResponse.pageSize,
      pagesCount: blogsResponse.totalNumberOfPages,
      page: +blogsResponse.currentPage,
      totalCount: blogsResponse.totalNumberOfPosts,
      items: blogsResponse.posts,
    };
  },
  async createNewPostByBlogId(post: PostsType, blogId: string, blogName: string) {
    return await blogsRepositories.createNewPostByBlogId(post, blogId, blogName);
  },
};
