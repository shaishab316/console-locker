import { Schema, model } from 'mongoose';
import { TBlog } from './Blog.interface';

const blogSchema = new Schema<TBlog>(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Blog = model<TBlog>('Blog', blogSchema);

export default Blog;
