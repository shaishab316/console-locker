import { model, Schema } from 'mongoose';
import { TOrder } from './Order.interface';
import { addressSchema } from '../customer/Customer.model';

const orderSchema = new Schema<TOrder>(
  {
    productDetails: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Customer',
    },
    address: addressSchema,
    secondary_phone: String,
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
  },
  {
    timestamps: true,
  },
);

export const Order = model<TOrder>('Order', orderSchema);
