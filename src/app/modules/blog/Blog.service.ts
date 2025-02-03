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

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  // async retrieve(blogId: string) {
  //   const blog = await Blog.findById(blogId);

  //   if (!blog) throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');

  //   return blog;
  // },

  async list({ page = '1', limit = '10' }: Record<any, any>) {
    const skip = (+page - 1) * +limit;

    const result = await Blog.aggregate([
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          blogs: [
            { $sort: { _id: -1 } },
            { $skip: skip },
            { $limit: +limit },
            {
              $addFields: {
                description: {
                  $concat: [{ $substrCP: ['$description', 0, 150] }, '...'],
                },
              },
            },
          ],
        },
      },
    ]);

    const totalBlogs = result[0].metadata[0]?.total || 0;
    const blogs = result[0].blogs;

    return {
      meta: {
        totalPages: Math.ceil(totalBlogs / +limit),
        page: +page,
        limit: +limit,
        total: totalBlogs,
      },
      blogs,
    };
  },
};
