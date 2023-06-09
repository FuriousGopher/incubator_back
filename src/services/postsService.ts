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
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [
          {
            addedAt: 0,
            userId: 0,
            userLogin: string;
          },
        ];
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

    const items = foundComments.comments.map((comment) => {
      const userLike = comment.likesInfo.users.find((user) => user.userId === userId);
      const myStatus = userLike ? userLike.likeStatus : 'None';

      return {
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
          myStatus,
        },
      };
    });

    return {
      pageSize: foundComments.pageSize,
      pagesCount: foundComments.totalNumberOfPages,
      page: +foundComments.currentPage,
      totalCount: foundComments.totalNumberOfPosts,
      items,
    };
  },

  async updateLikeStatus(postid: string, userId: string, likeStatus: string) {
    const foundPostById = await postsRepositories.getPostsById(postid);
    if (!foundPostById) return false;
  },
};
