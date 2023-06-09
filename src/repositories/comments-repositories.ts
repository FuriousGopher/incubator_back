import { CommentDBModel, CommentViewModel } from '../models/commentType';
import { uuid } from 'uuidv4';
import { UserDBModel } from '../models/userType';
import { EnhancedOmit, InferIdType } from 'mongodb';
import { CommentsMongooseModel } from '../Domain/CommentSchema';

export const commentsRepositories = {
  async createNewCommentByPostId(
    comment: CommentDBModel,
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
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
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

  async getCommentById(id: string, userId: string | undefined): Promise<CommentViewModel | null> {
    const foundComment = await CommentsMongooseModel.findOne({ id });

    if (!foundComment) {
      return null;
    }

    let likeStatus;

    if (userId) {
      const userLike = foundComment.likesInfo.users.find((user) => user.userId === userId);
      if (userLike) {
        likeStatus = userLike.likeStatus;
      }
    }

    return {
      id: foundComment.id,
      content: foundComment.content,
      commentatorInfo: {
        userId: foundComment.commentatorInfo.userId,
        userLogin: foundComment.commentatorInfo.userLogin,
      },
      createdAt: foundComment.createdAt,
      likesInfo: {
        likesCount: foundComment.likesInfo.likesCount,
        dislikesCount: foundComment.likesInfo.dislikesCount,
        myStatus: likeStatus || 'None',
      },
    };
  },

  async updateCommentById(comment: CommentDBModel, commentId: string) {
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

  async findUserInLikesInfo(commentId: string, userId: string) {
    const foundUser = await CommentsMongooseModel.findOne(CommentsMongooseModel.findOne({ id: commentId, 'likesInfo.users.userId': userId }));

    if (!foundUser) {
      return null;
    }

    return foundUser;
  },

  async addUserInLikesInfo(commentId: string, userId: string, likeStatus: string) {
    const result = await CommentsMongooseModel.updateOne(
      { id: commentId },
      {
        $push: {
          'likesInfo.users': {
            userId,
            likeStatus,
          },
        },
      },
    );
    return result.matchedCount === 1;
  },

  async updateLikesCount(commentId: string, likesCount: number, dislikesCount: number) {
    const result = await CommentsMongooseModel.updateOne(
      { id: commentId },
      {
        $set: {
          'likesInfo.likesCount': likesCount,
          'likesInfo.dislikesCount': dislikesCount,
        },
      },
    );
    return result.matchedCount === 1;
  },

  async findUserLikeStatus(commentId: string, userId: string): Promise<string | null> {
    const foundUser = await CommentsMongooseModel.findOne(
      { id: commentId },
      {
        'likesInfo.users': {
          $filter: {
            input: '$likesInfo.users',
            cond: { $eq: ['$$this.userId', userId] },
          },
        },
      },
    );

    if (!foundUser || foundUser.likesInfo.users.length === 0) {
      return null;
    }

    return foundUser.likesInfo.users[0].likeStatus;
  },

  async updateLikesStatus(commentId: string, userId: string, likeStatus: string): Promise<boolean> {
    const result = await CommentsMongooseModel.updateOne(
      { id: commentId, 'likesInfo.users.userId': userId },
      {
        $set: {
          'likesInfo.users.$.likeStatus': likeStatus,
        },
      },
    );
    return result.matchedCount === 1;
  },
};
