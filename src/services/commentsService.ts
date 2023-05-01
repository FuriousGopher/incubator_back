import { CommentType } from '../models/commentType';
import { commentsRepositories } from '../repositories/comments-repositories';
import { UserModel } from '../types/userType';

export const commentsService = {
  async createNewCommentByPostId(comment: CommentType, user: NonNullable<UserModel>, postId: string) {
    return await commentsRepositories.createNewCommentByPostId(comment, user, postId);
  },
};
