import { CommentType } from '../models/commentType';
import { uuid } from 'uuidv4';
import { commentCollection } from '../models/dbCollections';
import { UserModel } from '../types/userType';

export const commentsRepositories = {
  async createNewCommentByPostId(comment: CommentType, user: NonNullable<UserModel>) {
    const newComment = {
      id: uuid(),
      content: comment.content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
    };
    await commentCollection.insertOne({ ...newComment });
    return newComment;
  },
};
