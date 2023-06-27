import { postsRepositories } from '../repositories/posts-repositories';
import { PostDBModel } from '../models/postType';
import { GetAllBlogsQueryType } from '../DTO/queryForBlogs';
import { commentsRepositories } from '../repositories/comments-repositories';
import { uuid } from 'uuidv4';
import { blogsRepositories } from '../repositories/blogs-repositories';
import { UsersRepositories } from '../repositories/users-repositories';
import { PostViewModel } from '../models/view/postViewModel';
import { container } from '../composition-root';

const usersRepositories = container.resolve(UsersRepositories);

export const postsService = {
  async getAllPosts(
    query: {
      sortDirection: string;
      pageNumber: number;
      pageSize: number;
      sortBy: string;
    },
    userId?: string,
  ) {
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
      items: await this.mapGetAllPosts(postsResponse.posts, userId),
    };
  },

  async mapGetAllPosts(array: PostDBModel[], userId?: string) {
    return Promise.all(
      array.map(async (post) => {
        let status;

        if (userId) {
          status = await postsRepositories.findUserLikeStatus(post.id, userId);
        }

        const likesArray = post.likesInfo && post.likesInfo.users ? post.likesInfo.users : [];
        const likesCount = post.likesInfo ? post.likesInfo.likesCount : 0;

        return {
          id: post.id,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
          extendedLikesInfo: {
            likesCount,
            dislikesCount: post.likesInfo ? post.likesInfo.dislikesCount : 0,
            myStatus: status || 'None',
            newestLikes: likesArray
              .filter((post) => post.likeStatus === 'Like')
              .sort((a, b) => -a.addedAt.localeCompare(b.addedAt))
              .map((post) => {
                return {
                  addedAt: post.addedAt.toString(),
                  userId: post.userId,
                  login: post.userLogin,
                };
              })
              .splice(0, 3),
          },
        };
      }),
    );
  },

  async getPostsById(id: string, userId?: string) {
    return await postsRepositories.getPostsById(id, userId);
  },

  async createNewPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostViewModel | null> {
    const blog = await blogsRepositories.getBlogById(blogId);
    if (!blog) {
      return null;
    }
    const newPost = new PostDBModel(
      uuid(),
      title,
      shortDescription,
      content,
      blogId,
      blog.name,
      new Date().toISOString(),
      { likesCount: 0, dislikesCount: 0, users: [] },
    );

    return await postsRepositories.createNewPost(newPost);
  },

  async deletePostsById(id: string) {
    return await postsRepositories.deletePostsById(id);
  },

  async updatePostById(id: string, post: PostDBModel) {
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

  async updateLikeStatus(postId: string, userId: string, likeStatus: string) {
    const foundPostById = await postsRepositories.getPostsById(postId);
    if (!foundPostById) return false;

    let likesCount = foundPostById.extendedLikesInfo.likesCount;
    let dislikesCount = foundPostById.extendedLikesInfo.dislikesCount;

    const foundUser = await postsRepositories.findUserInLikesInfo(postId, userId);

    const addedAt = new Date().toISOString();
    const user = await usersRepositories.findUserById(userId);
    const login = user!.accountData.login;

    if (!foundUser) {
      await postsRepositories.pushUserInExtendedLikesInfo(postId, userId, likeStatus, addedAt, login);

      if (likeStatus === 'Like') {
        likesCount++;
      }

      if (likeStatus === 'Dislike') {
        dislikesCount++;
      }

      return postsRepositories.updateLikesCount(postId, likesCount, dislikesCount);
    }

    const userLikeDBStatus = await postsRepositories.findUserLikeStatus(postId, userId);

    switch (userLikeDBStatus) {
      case 'None':
        if (likeStatus === 'Like') {
          likesCount++;
        }

        if (likeStatus === 'Dislike') {
          dislikesCount++;
        }

        break;

      case 'Like':
        if (likeStatus === 'None') {
          likesCount--;
        }

        if (likeStatus === 'Dislike') {
          likesCount--;
          dislikesCount++;
        }
        break;

      case 'Dislike':
        if (likeStatus === 'None') {
          dislikesCount--;
        }

        if (likeStatus === 'Like') {
          dislikesCount--;
          likesCount++;
        }
    }

    await postsRepositories.updateLikesCount(postId, likesCount, dislikesCount);

    return postsRepositories.updateLikesStatus(postId, userId, likeStatus);
  },
};
