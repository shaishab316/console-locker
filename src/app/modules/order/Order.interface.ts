import { Types } from 'mongoose';
import { TAddress } from '../customer/Customer.interface';

export type TOrder = {
  _id?: Types.ObjectId;
  productDetails: {
    product: Types.ObjectId;
    price: number;
    quantity: number;
  }[];
  customer: Types.ObjectId;
  transaction?: Types.ObjectId;
  payment_method?: string;
  amount: number;
  state: TOrderState;
  address?: TAddress;
  secondary_phone?: string;
  receipt?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TOrderState = 'pending' | 'shipped' | 'success' | 'cancel';
