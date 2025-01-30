import { model, Schema } from 'mongoose';
import { TOrder } from './Order.interface';

const orderSchema = new Schema<TOrder>({
  productDetails: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      price: { type: Number, required: true, min: 0 },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  customer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  transaction: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
  },
  payment_method: {
    type: String,
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
    enum: ['pending', 'shipped', 'success', 'cancel'],
    default: 'pending',
  },
});

export const Order = model<TOrder>('Order', orderSchema);
