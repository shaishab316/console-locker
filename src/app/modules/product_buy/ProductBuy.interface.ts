import { Types } from 'mongoose';

export type TProductBuy = {
  customer: Types.ObjectId;
  product: Types.ObjectId;
  information: {
    ques: string;
    option: string;
  }[];
  price: number;
  payment: {
    paypal?: string;
    bank?: string;
  };
};
