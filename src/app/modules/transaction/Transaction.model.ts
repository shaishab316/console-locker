import { model, Schema } from 'mongoose';
import { TTransaction } from './Transaction.interface';

const transactionSchema = new Schema<TTransaction>({
  transaction_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    required: true,
    enum: ['buy', 'sell'],
  },
  payment_method: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Transaction = model<TTransaction>(
  'Transaction',
  transactionSchema,
);
