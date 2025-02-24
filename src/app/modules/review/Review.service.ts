import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import Product from '../product/Product.model';
import { TReview } from './Review.interface';
import Review from './Review.model';
import { Customer } from '../customer/Customer.model';

export const ReviewService = {
  async store(reviewData: TReview) {
    const productExists = await Product.exists({ name: reviewData.product });
    const customer = await Customer.findById(reviewData.customer);

    if (!productExists || !customer)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Product not found or customer not found',
      );

    reviewData.customer = {
      name: customer.name,
      avatar: customer.avatar,
    };

    reviewData.customerRef = customer._id;

    const review = await Review.findOneAndUpdate(
      { customerRef: customer._id, product: reviewData.product },
      reviewData,
      { new: true, upsert: true, runValidators: true },
    );

    return review;
  },

  async create(reviewData: TReview) {
    return await Review.create(reviewData);
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

  async update(reviewId: string, reviewData: Partial<TReview>) {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId },
      reviewData,
      { new: true, upsert: true, runValidators: true },
    );

    return updatedReview;
  },

  async deleteById(reviewId: string) {
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');

    return deletedReview;
  },

  async delete(customerRef: string) {
    const deletedReview = await Review.findOneAndDelete({ customerRef });

    if (!deletedReview)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');

    return deletedReview as TReview;
  },
};
