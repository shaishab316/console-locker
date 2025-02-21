import { StatusCodes } from 'http-status-codes';
import catchAsync, { catchAsyncWithCallback } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { imagesUploadRollback } from '../../middlewares/imageUploader';
import { BlogService } from './Blog.service';

export const BlogController = {
  create: catchAsyncWithCallback(async (req, res) => {
    const images: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        images.push(`/images/${filename}`),
      );

    req.body.image = images[0];

    const newBlog = await BlogService.create({
      ...req.body,
      admin: req.admin!._id,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog has created successfully!',
      data: newBlog,
    });
  }, imagesUploadRollback),

  update: catchAsyncWithCallback(async (req, res) => {
    const newImages: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        newImages.push(`/images/${filename}`),
      );

    if (newImages.length) req.body.image = newImages[0];

    const updatedBlog = await BlogService.update(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog has been updated successfully!',
      data: updatedBlog,
    });
  }, imagesUploadRollback),

  slugAvailable: catchAsync(async (req, res) => {
    const isSlugAvailable = await BlogService.slugAvailable(
      req.query.slug as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Slug check successfully!',
      data: { isSlugAvailable },
    });
  }),

  delete: catchAsync(async (req, res) => {
    await BlogService.delete(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog has been deleted successfully!',
    });
  }),

  retrieve: catchAsync(async (req, res) => {
    const blog = await BlogService.retrieve(req.params.slug);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog retrieved successfully!',
      data: blog,
    });
  }),

  list: catchAsync(async (req, res) => {
    const data = await BlogService.list(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blogs retrieved successfully!',
      data,
    });
  }),
};
