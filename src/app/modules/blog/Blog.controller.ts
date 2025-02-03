import { StatusCodes } from 'http-status-codes';
import { catchAsyncWithCallback } from '../../../shared/catchAsync';
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
};
