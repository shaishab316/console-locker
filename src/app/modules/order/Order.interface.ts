import { Types } from 'mongoose';

export type TOrder = {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  customer: Types.ObjectId;
  transaction: Types.ObjectId;
  payment_method: string;
  amount: number;
  state: TOrderState;
  quantity: number;
};

export type TOrderState = 'padding' | 'shipped' | 'success' | 'cancel';
