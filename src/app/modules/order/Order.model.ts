import { model, Schema } from 'mongoose';
import { TOrder } from './Order.interface';

const orderSchema = new Schema<TOrder>({
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  customer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  transaction: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Transaction',
  },
  payment_method: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  state: {
    type: String,
    required: true,
    enum: ['padding', 'shipped', 'success', 'cancel'], 
    default: 'padding',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, 
  },
});

export const Order = model<TOrder>('Order', orderSchema);
