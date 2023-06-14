import { BlogType } from '../models/blogType';
import { uuid } from 'uuidv4';
import { WithId } from 'mongodb';
import { BlogsMongooseModel } from '../Domain/BlogSchema';
import { PostsMongooseModel } from '../Domain/PostSchema';
import { PostViewModel } from '../models/view/postViewModel';

export const blogsRepositories = {
  async getBlogById(id: string): Promise<WithId<BlogType> | null> {
    return BlogsMongooseModel.findOne({ id: id }, { projection: { _id: 0 } });
  },

  async getAllBlogs(
    pageNumber: number,
    nPerPage: number,
    sortBy: string,
    sortDirection: 1 | -1,
    searchNameTerm: string | null,
  ) {
    let filter = {};
    if (searchNameTerm) {
      const regex = new RegExp(searchNameTerm, 'i');
      filter = { name: { $regex: regex } };
    }
    const totalNumberOfDocuments = await BlogsMongooseModel.countDocuments(filter);
    const foundBlogs = await BlogsMongooseModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .lean();
    return {
      blogs: foundBlogs,
      totalNumberOfBlogs: totalNumberOfDocuments,
      currentPage: pageNumber,
      totalNumberOfPages: Math.ceil(totalNumberOfDocuments / nPerPage),
      pageSize: nPerPage,
    };
  },
  async createNewBlog(blog: BlogType) {
    const newBlog = {
      id: uuid(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    await BlogsMongooseModel.create({ ...newBlog });
    return newBlog;
  },

  async deleteBlogById(id: string) {
    const result = await BlogsMongooseModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async updateBlogById(id: string, blog: BlogType) {
    const result = await BlogsMongooseModel.updateOne(
      { id: id },
      {
        $set: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
        },
      },
    );
    return result.matchedCount === 1;
  },

  async createNewPostByBlogId(post: PostViewModel, blogId: string, blogName: string) {
    const newPost = {
      id: uuid(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: 'None',
        newestLikes: [],
      },
    };

    await PostsMongooseModel.create({ ...newPost });
    return newPost;
  },
};
