import { Types } from 'mongoose';

export type TReview = {
  _id: string;
  customer: {
    name: string;
    avatar: string;
  };
  customerRef?: Types.ObjectId;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};
