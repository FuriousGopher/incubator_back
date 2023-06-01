import mongoose from 'mongoose';
import { CommentDBModel } from '../models/commentType';

const commentDBModel = new mongoose.Schema<CommentDBModel>({
  id: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
});

export const CommentsMongooseModel = mongoose.model('comments', commentDBModel);
