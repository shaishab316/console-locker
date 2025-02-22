import { Types } from 'mongoose';

export type TReview = {
  _id: string;
  customer: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
};
