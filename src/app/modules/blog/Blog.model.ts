import { Schema, model } from 'mongoose';
import { TBlog } from './Blog.interface';
import slugify from 'slugify';

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
    slug: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Middleware to generate slug before saving
blogSchema.pre('validate', async function (next) {
  if (this.isModified('title')) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let newSlug = baseSlug;

    // Check if the base slug exists
    let existingBlog = await Blog.findOne({ slug: newSlug });
    let counter = 2; // Start from 2 instead of 1

    while (existingBlog) {
      newSlug = `${baseSlug}-${counter}`;
      existingBlog = await Blog.findOne({ slug: newSlug });
      counter++;
    }

    this.slug = newSlug;
  }
  next();
});

const Blog = model<TBlog>('Blog', blogSchema);

export default Blog;
