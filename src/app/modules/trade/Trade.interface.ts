import { Types } from 'mongoose';

export type TTrade = {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  price: number;
  brand: string;
  model: string;
  memory: string;
  product_type: string;
};
