import { model, Schema } from 'mongoose';
import { TReview } from './Review.interface';

const reviewSchema = new Schema<TReview>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Customer',
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    rating: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5,
      validate: {
        validator: (value: number) => !(value % 0.5),
        message:
          'Rating must be in increments of 0.5 (e.g., 0.5, 1, 1.5, ..., 5)',
      },
    },
    review: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Review = model<TReview>('Review', reviewSchema);

export default Review;
