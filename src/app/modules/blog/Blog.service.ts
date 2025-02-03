import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TBlog } from './Blog.interface';
import Blog from './Blog.model';
import deleteFile from '../../../shared/deleteFile';

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
    if (updatedData.image) await deleteFile(existingBlog.image);

    return updatedBlog;
  },

  async delete(blogId: string) {
    const existingBlog = await Blog.findByIdAndDelete(blogId);

    if (!existingBlog)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');

    // Delete blog image
    await deleteFile(existingBlog.image);
  },
};
