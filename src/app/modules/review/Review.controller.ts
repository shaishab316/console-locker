import { StatusCodes } from 'http-status-codes';
import catchAsync, { catchAsyncWithCallback } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './Review.service';
import { imagesUploadRollback } from '../../middlewares/imageUploader';
import { TReview } from './Review.interface';

export const ReviewController = {
  store: catchAsync(async (req, res) => {
    const review = await ReviewService.store(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Review stored successfully!',
      data: review,
    });
  }),

  create: catchAsyncWithCallback(async (req, res) => {
    const images: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        images.push(`/images/${filename}`),
      );

    const reviewData: Partial<TReview> = {
      customer: {
        name: req.body.customerName,
        avatar: images[0],
      },
      rating: +req.body.rating,
      comment: (req.body.comment as string)?.trim(),
      product: req.body.product,
    };

    const newReview = await ReviewService.create(reviewData as TReview);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Review created successfully!',
      data: newReview,
    });
  }, imagesUploadRollback),

  list: catchAsync(async (req, res) => {
    const reviews = await ReviewService.list(req.params.productName, req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Reviews retrieved successfully.',
      data: reviews,
    });
  }),

  update: catchAsync(async (req, res) => {
    const reviewData: Partial<TReview> = {
      rating: req.body.rating,
      comment: (req.body.comment as string)?.trim(),
    };

    const updatedReview = await ReviewService.update(
      req.params.reviewId,
      reviewData,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Review has updated successfully!',
      data: updatedReview,
    });
  }),

  deleteById: catchAsync(async (req, res) => {
    await ReviewService.deleteById(req.params.reviewId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Review has deleted successfully!',
    });
  }),

  delete: catchAsync(async (req, res) => {
    await ReviewService.delete(req.body.customer);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Review has deleted successfully!',
    });
  }),
};
