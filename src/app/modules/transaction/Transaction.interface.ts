import { Types } from 'mongoose';

export type TTransaction = {
  _id?: Types.ObjectId;
  transaction_id?: string;
  customer: Types.ObjectId;
  amount: number;
  type: 'buy' | 'sell';
  payment_method: string;
};
