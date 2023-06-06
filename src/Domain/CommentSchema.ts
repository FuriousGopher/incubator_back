import mongoose from 'mongoose';
import { CommentDBModel, CommentDBModelType } from '../models/commentType';

const commentDBModel = new mongoose.Schema<CommentDBModelType>({
  id: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
  likesInfo: {
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
    users: { type: Array, required: true },
  },
});

export const CommentsMongooseModel = mongoose.model('comments', commentDBModel);
