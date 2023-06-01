import mongoose from 'mongoose';
import { BlogDBModel } from '../models/blogType';

const blogDBModel = new mongoose.Schema<BlogDBModel>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
});

export const BlogsMongooseModel = mongoose.model('blogs', blogDBModel);
