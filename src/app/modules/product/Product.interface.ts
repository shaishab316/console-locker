import { Types } from 'mongoose';

export type TProduct = {
  _id?: Types.ObjectId;
  admin: Types.ObjectId;
  images: string[];
  name: string;
  description: string;
  price: number;
  offer_price?: number;
  brand: string;
  model: string;
  condition: TCondition;
  controller: number;
  memory: string;
  quantity: number;
  variants: Partial<TProduct>[];
};

export type TCondition = 'fair' | 'good' | 'excellent';
