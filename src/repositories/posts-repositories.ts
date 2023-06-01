import { PostType } from '../models/postType';
import { uuid } from 'uuidv4';
import { WithId } from 'mongodb';
import { PostsMongooseModel } from '../Domain/PostSchema';
import { BlogsMongooseModel } from '../Domain/BlogSchema';

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

  async getPostsById(id: string): Promise<WithId<PostType> | null> {
    return PostsMongooseModel.findOne({ id: id }, { projection: { _id: 0 } });
  },

  async createNewPost(post: PostType) {
    const blog = await BlogsMongooseModel.findOne({ id: post.blogId });
    if (!blog) {
      return false;
    }
    const newPost = {
      id: uuid(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    await PostsMongooseModel.create({ ...newPost });
    return newPost;
  },

  async deletePostsById(id: string) {
    const result = await PostsMongooseModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async updatePostById(id: string, post: PostType) {
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
};
