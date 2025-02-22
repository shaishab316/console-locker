import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import Product from '../product/Product.model';
import { TReview } from './Review.interface';
import Review from './Review.model';
import { Customer } from '../customer/Customer.model';

export const ReviewService = {
  async store(reviewData: TReview) {
    const productExists = await Product.exists({ name: reviewData.product });
    const customerExists = await Customer.exists({ _id: reviewData.customer });

    if (!productExists || !customerExists)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Product not found or customer not found',
      );

    const review = await Review.findOneAndUpdate(
      { customer: reviewData.customer, product: reviewData.product },
      reviewData,
      { new: true, upsert: true, runValidators: true },
    );

    return review;
  },

  async list(productName: string, query: Record<any, any>) {
    const { page = '1', limit = '10' } = query;
    const skip = (+page - 1) * +limit;

    const reviews = await Review.find({ product: productName })
      .skip(skip)
      .limit(+limit)
      .populate('customer', 'name avatar');

    return reviews;
  },

  async delete(reviewId: string) {
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');

    return deletedReview;
  },
};
