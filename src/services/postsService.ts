import { MethodGetAllReqQueryById } from '../types/queryType';
import { postsRepositories } from '../repositories/posts-repositories';
import { PostDBModel, PostType } from '../models/postType';
import { GetAllBlogsQueryType } from '../DTO/queryForBlogs';
import { commentsRepositories } from '../repositories/comments-repositories';
import { uuid } from 'uuidv4';
import { blogsRepositories } from '../repositories/blogs-repositories';

export const postsService = {
  async getAllPosts(query: MethodGetAllReqQueryById) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const postsResponse = await postsRepositories.getAllPosts(
      query.pageNumber,
      query.pageSize,
      query.sortBy,
      sortDirection,
    );
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
  async createNewPost(post: PostDBModel) {
    const blog = await blogsRepositories.getBlogById(post.blogId);
    if (!blog) {
      return false;
    }
    const newPost = {
      id: uuid(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        users: [],
      },
    };

    return await postsRepositories.createNewPost(newPost);
  },
  async deletePostsById(id: string) {
    return await postsRepositories.deletePostsById(id);
  },
  async updatePostById(id: string, post: PostType) {
    return await postsRepositories.updatePostById(id, post);
  },
  async getAllCommentsByPostId(query: GetAllBlogsQueryType, postId: string, userId?: string) {
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1;
    const foundComments = await commentsRepositories.getAllCommentsByPostId(
      postId,
      query.pageNumber,
      query.pageSize,
      query.sortBy,
      sortDirection,
    );

    let likeStatus: string | undefined;

    if (userId) {
      const commentWithUser = foundComments.comments.find((comment) =>
        comment.likesInfo.users.some((user) => user.userId === userId),
      );
      if (commentWithUser) {
        const userLike = commentWithUser.likesInfo.users.find((user) => user.userId === userId);
        if (userLike) {
          likeStatus = userLike.likeStatus;
        }
      }
    }

    const items = foundComments.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: likeStatus || 'None',
      },
    }));

    return {
      pagesCount: foundComments.totalNumberOfPages,
      page: +foundComments.currentPage,
      pageSize: foundComments.pageSize,
      totalCount: foundComments.totalNumberOfPosts,
      items,
    };
  },
};
