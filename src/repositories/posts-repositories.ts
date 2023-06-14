import { PostDBModel } from '../models/postType';
import { PostsMongooseModel } from '../Domain/PostSchema';
import { PostViewModel } from '../models/view/postViewModel';

export const postsRepositories = {
  async getAllPosts(pageNumber: number, nPerPage: number, sortBy: string, sortDirection: 1 | -1) {
    const foundPosts = await PostsMongooseModel.find()
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .lean();
    const totalNumberOfPosts = await PostsMongooseModel.countDocuments();
    return {
      posts: foundPosts,
      totalNumberOfPosts: totalNumberOfPosts,
      currentPage: pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfPosts / nPerPage),
      pageSize: nPerPage,
    };
  },

  async getPostsById(id: string, userId?: string | undefined): Promise<PostViewModel | null> {
    const foundPost = await PostsMongooseModel.findOne({ id });
    if (!foundPost) {
      return null;
    }

    let likeStatus;

    if (userId) {
      const userLike = foundPost.likesInfo.users.find((user) => user.userId === userId);
      if (userLike) {
        likeStatus = userLike.likeStatus;
      }
    }

    const userLikes = foundPost.likesInfo.users;

    return {
      id: foundPost.id,
      title: foundPost.title,
      shortDescription: foundPost.shortDescription,
      content: foundPost.content,
      blogId: foundPost.blogId,
      blogName: foundPost.blogName,
      createdAt: foundPost.createdAt,
      extendedLikesInfo: {
        likesCount: foundPost.likesInfo.likesCount,
        dislikesCount: foundPost.likesInfo.dislikesCount,
        myStatus: likeStatus || 'None',
        newestLikes: userLikes
          .filter((post) => post.likeStatus === 'Like')
          .sort((a, b) => -a.addedAt.localeCompare(b.addedAt))
          .map((post) => {
            return {
              addedAt: post.addedAt,
              userId: post.userId,
              login: post.userLogin,
            };
          })
          .splice(0, 3),
      },
    };
  },

  async createNewPost(newPost: PostDBModel): Promise<PostViewModel> {
    await PostsMongooseModel.create(newPost);
    return {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
      extendedLikesInfo: {
        likesCount: newPost.likesInfo.likesCount,
        dislikesCount: newPost.likesInfo.likesCount,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  },

  async deletePostsById(id: string) {
    const result = await PostsMongooseModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async updatePostById(id: string, post: PostDBModel) {
    const result = await PostsMongooseModel.updateOne(
      { id: id },
      {
        $set: {
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
        },
      },
    );
    return result.matchedCount === 1;
  },

  async getPostsByBlogId(blogId: string, pageNumber: number, nPerPage: number, sortBy: string, sortDirection: -1 | 1) {
    const foundPosts = await PostsMongooseModel.find({ blogId: blogId }, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(Number(nPerPage))
      .lean();
    const totalNumberOfDocuments = await PostsMongooseModel.countDocuments({ blogId: blogId });
    return {
      posts: foundPosts,
      totalNumberOfPosts: totalNumberOfDocuments,
      currentPage: +pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfDocuments / nPerPage),
      pageSize: nPerPage,
    };
  },

  async findUserInLikesInfo(postId: string, userId: string): Promise<PostDBModel | null> {
    const foundUser = await PostsMongooseModel.findOne(
      PostsMongooseModel.findOne({
        id: postId,
        'likesInfo.users.userId': userId,
      }),
    );

    if (!foundUser) {
      return null;
    }

    return foundUser;
  },

  async pushUserInExtendedLikesInfo(
    postId: string,
    userId: string,
    likeStatus: string,
    addedAt: string,
    userLogin: string,
  ): Promise<boolean> {
    const result = await PostsMongooseModel.updateOne(
      { id: postId },
      {
        $push: {
          'likesInfo.users': {
            addedAt,
            userId,
            userLogin,
            likeStatus,
          },
        },
      },
    );
    return result.matchedCount === 1;
  },

  async findUserLikeStatus(postId: string, userId: string): Promise<string | null> {
    const foundUser = await PostsMongooseModel.findOne(
      { id: postId },
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

  async updateLikesCount(postId: string, likesCount: number, dislikesCount: number): Promise<boolean> {
    const result = await PostsMongooseModel.updateOne(
      { id: postId },
      {
        $set: {
          'likesInfo.likesCount': likesCount,
          'likesInfo.dislikesCount': dislikesCount,
        },
      },
    );
    return result.matchedCount === 1;
  },

  async updateLikesStatus(postId: string, userId: string, likeStatus: string): Promise<boolean> {
    const result = await PostsMongooseModel.updateOne(
      { id: postId, 'likesInfo.users.userId': userId, 'likesInfo.users': { $elemMatch: { userId: userId } } },
      {
        $set: {
          'likesInfo.users.$.likeStatus': likeStatus,
        },
      },
    );
    return result.matchedCount === 1;
  },
};
