import { Types } from 'mongoose';

export type TOrder = {
  _id?: Types.ObjectId;
  productDetails: {
    product: Types.ObjectId;
    price: number;
    quantity: number;
  };
  customer: Types.ObjectId;
  transaction?: Types.ObjectId;
  payment_method?: string;
  amount: number;
  state: TOrderState;
};

export type TOrderState = 'padding' | 'shipped' | 'success' | 'cancel';
