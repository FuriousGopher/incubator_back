import { CommentType } from '../models/commentType';
import { uuid } from 'uuidv4';
import { UserDBModel } from '../models/userType';
import { EnhancedOmit, InferIdType } from 'mongodb';
import { CommentsMongooseModel } from '../Domain/CommentSchema';

export const commentsRepositories = {
  async createNewCommentByPostId(
    comment: CommentType,
    user: EnhancedOmit<UserDBModel, '_id'> & {
      _id: InferIdType<UserDBModel>;
    },
    postId: string,
  ) {
    const newComment = {
      id: uuid(),
      content: comment.content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.accountData.login,
      },
      createdAt: new Date().toISOString(),
      postId: postId,
    };
    await CommentsMongooseModel.create({ ...newComment });
    return newComment;
  },
  async getAllCommentsByPostId(postId: string, pageNumber: number, nPerPage: number, sortBy: string, sortDirection: -1 | 1) {
    const foundComments = await CommentsMongooseModel.find({ postId: postId }, { projection: { _id: 0, postId: 0 } })
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(Number(nPerPage))
      .lean();
    const totalNumberOfDocuments = await CommentsMongooseModel.countDocuments({ postId: postId });
    return {
      comments: foundComments,
      totalNumberOfPosts: totalNumberOfDocuments,
      currentPage: +pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfDocuments / nPerPage),
      pageSize: nPerPage,
    };
  },
  async getCommentById(id: string) {
    return CommentsMongooseModel.findOne({ id: id }, { projection: { _id: 0, postId: 0 } });
  },
  async updateCommentById(comment: CommentType, commentId: string) {
    const result = await CommentsMongooseModel.updateOne(
      { id: commentId },
      {
        $set: {
          content: comment.content,
        },
      },
    );
    return result.matchedCount === 1;
  },
  async checkCommentUserId(commentId: string, userId: string) {
    const comment = await CommentsMongooseModel.findOne({ id: commentId });
    if (!comment) {
      return false;
    }
    return comment.commentatorInfo.userId === userId;
  },
  async deleteCommentById(id: string) {
    const result = await CommentsMongooseModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
};
