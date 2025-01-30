import { Types } from 'mongoose';

export type TProduct = {
  _id?: Types.ObjectId;
  admin: Types.ObjectId;
  images: string[];
  name: string;
  description?: string;
  price: number;
  offer_price?: number;
  brand?: string;
  model?: string;
  condition: TCondition;
  controller?: number;
  memory?: string;
  quantity: number;
  isVariant: boolean;
  product_type?: string;
  product_ref?: Types.ObjectId;
};

export type TCondition = 'fair' | 'good' | 'excellent';
