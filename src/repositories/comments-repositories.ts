import { CommentType } from '../models/commentType';
import { uuid } from 'uuidv4';
import { commentCollection } from '../models/dbCollections';
import { UserModel } from '../types/userType';

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
};
