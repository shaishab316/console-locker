import { Types } from 'mongoose';

export type TTradeIn = {
  customer: Types.ObjectId;
  product: Types.ObjectId;
  ref_product?: Types.ObjectId;
  information: {
    ques: string;
    value: string;
  }[];
  price: number;
  payment: {
    paypal?: string;
    bank?: string;
  };
  state: 'pending' | 'confirm' | 'cancel';
};
