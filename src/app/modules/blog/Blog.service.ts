import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TBlog } from './Blog.interface';
import Blog from './Blog.model';
import unlinkFile from '../../../shared/unlinkFile';

export const BlogService = {
  create: async (blogData: TBlog) => await Blog.create(blogData),
  async update(blogId: string, updatedData: Partial<TBlog>) {
    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, {
      new: true,
    });

    // Delete old image if new image was uploaded
    if (updatedData.image) unlinkFile(existingBlog.image);

    return updatedBlog;
  },
};
