import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TBlog } from './Blog.interface';
import Blog from './Blog.model';
import deleteFile from '../../../shared/deleteFile';
import slugify from 'slugify';
import { Types } from 'mongoose';

export const BlogService = {
  create: async (blogData: TBlog) => await Blog.create(blogData),

  async update(blogId: string, updatedData: Partial<TBlog>) {
    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, {
      new: true,
      runValidators: true,
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

  async slugAvailable(slug: string) {
    const existingBlog = await Blog.findOne({
      slug: slugify(slug, { lower: true, strict: true }), // ! make sure slug is unique
    });

    return !existingBlog;
  },

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  async retrieve(slug: string) {
    const blog = await Blog.findOne({ slug }).populate('admin', 'name avatar');

    if (!blog) throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');

    const relatedBlogs = await this.relatedBlogs(blog._id);

    return { blog, relatedBlogs };
  },

  async list({ page = '1', limit = '10' }: Record<any, any>) {
    const skip = (+page - 1) * +limit;

    const result = await Blog.aggregate([
      {
        $lookup: {
          from: 'admins',
          localField: 'admin',
          foreignField: '_id',
          as: 'admin',
        },
      },
      { $unwind: '$admin' },
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
            {
              $project: {
                admin: { name: 1, avatar: 1 },
                image: 1,
                title: 1,
                description: 1,
                slug: 1,
                createdAt: 1,
                updatedAt: 1,
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

  relatedBlogs: async (blogId: Types.ObjectId) => {
    const blogs = await Blog.find({
      _id: { $ne: blogId },
    })
      .limit(3)
      .populate('admin', 'name avatar');

    return blogs;
  },
};
