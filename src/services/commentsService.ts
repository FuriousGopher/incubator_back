import { CommentType } from '../models/commentType';
import { commentsRepositories } from '../repositories/comments-repositories';
import { UserModel } from '../types/userType';

export const commentsService = {
  async createNewCommentByPostId(comment: CommentType, user: NonNullable<UserModel>, postId: string) {
    return await commentsRepositories.createNewCommentByPostId(comment, user, postId);
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
};
