import { CommentType } from '../models/commentType';
import { commentsRepositories } from '../repositories/comments-repositories';
import { postsRepositories } from '../repositories/posts-repositories';
import { HttpStatusCode } from '../types/HTTP-Response';
import { usersService } from './usersService';
import { HttpError } from '../types/errorType';

export const commentsService = {
  async createNewCommentByPostId(comment: CommentType, userId: string, postId: string) {
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
    return await commentsRepositories.getCommentById(id);
  },
  async updateCommentById(comment: CommentType, commentId: string) {
    return await commentsRepositories.updateCommentById(comment, commentId);
  },
  async deleteCommentById(id: string) {
    return await commentsRepositories.deleteCommentById(id);
  },
  async checkCommentUserId(commentId: string, userId: string) {
    return await commentsRepositories.checkCommentUserId(commentId, userId);
  },
};
