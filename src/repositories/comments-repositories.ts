import { CommentType } from '../models/commentType';
import { uuid } from 'uuidv4';
import { commentCollection } from '../models/dbCollections';
import { UserModel } from '../types/userType';
import { EnhancedOmit, InferIdType } from 'mongodb';

export const commentsRepositories = {
  async createNewCommentByPostId(comment: CommentType, user: NonNullable<UserModel>, postId: string) {
    const newComment = {
      id: uuid(),
      content: comment.content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      postId: postId,
    };
    await commentCollection.insertOne({ ...newComment });
    return newComment;
  },
  async getAllCommentsByPostId(postId: string, pageNumber: number, nPerPage: number, sortBy: string, sortDirection: -1 | 1) {
    const foundComments = await commentCollection
      .find({ postId: postId }, { projection: { _id: 0, postId: 0 } })
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(Number(nPerPage))
      .toArray();
    const totalNumberOfDocuments = await commentCollection.countDocuments({ postId: postId });
    return {
      comments: foundComments,
      totalNumberOfPosts: totalNumberOfDocuments,
      currentPage: +pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfDocuments / nPerPage),
      pageSize: nPerPage,
    };
  },
  async getCommentById(id: string) {
    return commentCollection.findOne({ id: id }, { projection: { _id: 0, postId: 0 } });
  },
  async updateCommentById(comment: CommentType, commentId: string) {
    const result = await commentCollection.updateOne(
      { id: commentId },
      {
        $set: {
          content: comment.content,
        },
      },
    );
    return result.matchedCount === 1;
  },
  async checkCommentUserId(commentId: string, user: EnhancedOmit<UserModel, '_id'> & { _id: InferIdType<UserModel> }) {
    const comment = await commentCollection.findOne({ id: commentId });
    if (!comment) {
      return false;
    }
    const { id } = user;
    return comment.commentatorInfo.userId === id;
  },
  async deleteCommentById(id: string) {
    const result = await commentCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
};
