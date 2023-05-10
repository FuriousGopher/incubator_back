import { PostType } from '../models/postType';
import { uuid } from 'uuidv4';
import { blogsCollection, postsCollection } from '../models/dbCollections';
import { WithId } from 'mongodb';

export const postsRepositories = {
  async getAllPosts(pageNumber: number, nPerPage: number, sortBy: string, sortDirection: 1 | -1) {
    const foundPosts = await postsCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .project({ _id: false })
      .toArray();
    const totalNumberOfPosts = await postsCollection.countDocuments();
    return {
      posts: foundPosts,
      totalNumberOfPosts: totalNumberOfPosts,
      currentPage: pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfPosts / nPerPage),
      pageSize: nPerPage,
    };
  },

  async getPostsById(id: string): Promise<WithId<PostType> | null> {
    return postsCollection.findOne({ id: id }, { projection: { _id: 0 } });
  },

  async createNewPost(post: PostType) {
    const blog = await blogsCollection.findOne({ id: post.blogId });
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

    await postsCollection.insertOne({ ...newPost });
    return newPost;
  },

  async deletePostsById(id: string) {
    const result = await postsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async updatePostById(id: string, post: PostType) {
    const result = await postsCollection.updateOne(
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
    const foundPosts = await postsCollection
      .find({ blogId: blogId }, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(Number(nPerPage))
      .toArray();
    const totalNumberOfDocuments = await postsCollection.countDocuments({ blogId: blogId });
    return {
      posts: foundPosts,
      totalNumberOfPosts: totalNumberOfDocuments,
      currentPage: +pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfDocuments / nPerPage),
      pageSize: nPerPage,
    };
  },
};
