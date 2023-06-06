import { commentsRepositories } from '../repositories/comments-repositories';
import { postsRepositories } from '../repositories/posts-repositories';
import { HttpStatusCode } from '../types/HTTP-Response';
import { usersService } from './usersService';
import { HttpError } from '../types/errorType';
import { CommentDBModel } from '../models/commentType';

export const commentsService = {
  async createNewCommentByPostId(comment: CommentDBModel, userId: string, postId: string) {
    try {
      const user = await usersService.findUserById(userId);
      if (!user) {
        throw new HttpError('User not found', HttpStatusCode.Unauthorized);
      }
      const post = await postsRepositories.getPostsById(postId);
      if (!post) {
        throw new HttpError('Post not found', HttpStatusCode.NotFound);
      }
      return await commentsRepositories.createNewCommentByPostId(comment, user, postId);
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof HttpError) {
        throw e;
      } else {
        throw new HttpError('Server error', HttpStatusCode.InternalServerError);
      }
    }
  },

  async getCommentById(id: string) {
    return commentsRepositories.getCommentById(id);
  },

  async updateCommentById(comment: CommentDBModel, commentId: string) {
    return await commentsRepositories.updateCommentById(comment, commentId);
  },

  async deleteCommentById(id: string) {
    return await commentsRepositories.deleteCommentById(id);
  },

  async checkCommentUserId(commentId: string, userId: string) {
    return await commentsRepositories.checkCommentUserId(commentId, userId);
  },

  async updateLikeStatus(commentId: string, userId: string, likeStatus: string) {
    const foundCommentById = await commentsRepositories.getCommentById(commentId);
    if (!foundCommentById) return false;

    let likesCount = foundCommentById.likesInfo.likesCount;
    let dislikesCount = foundCommentById.likesInfo.dislikesCount;

    const findUser = await commentsRepositories.findUserInLikesInfo(commentId, userId);

    if (!findUser) {
      await commentsRepositories.addUserInLikesInfo(commentId, userId, likeStatus);

      if (likeStatus === 'Like') {
        likesCount++;
      }

      if (likeStatus === 'Dislike') {
        dislikesCount++;
      }
      return commentsRepositories.updateLikesCount(commentId, likesCount, dislikesCount);
    }

    const userLikeDBStatus = await commentsRepositories.findUserLikeStatus(commentId, userId);

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

    await commentsRepositories.updateLikesCount(commentId, likesCount, dislikesCount);

    return commentsRepositories.updateLikesStatus(commentId, userId, likeStatus);
  },
};
