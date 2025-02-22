import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './Review.service';

export const ReviewController = {
  store: catchAsync(async (req, res) => {
    const newReview = await ReviewService.store(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Review has created successfully!',
      data: newReview,
    });
  }),

  list: catchAsync(async (req, res) => {
    const reviews = await ReviewService.list(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Reviews retrieved successfully.',
      data: reviews,
    });
  }),

  delete: catchAsync(async (req, res) => {
    await ReviewService.delete(req.params.reviewId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Review has deleted successfully!',
    });
  }),
};
