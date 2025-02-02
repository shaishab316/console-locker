import { model, Schema } from 'mongoose';
import { TTradeIn } from './TradeIn.interface';

const tradeInSchema = new Schema<TTradeIn>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'ProductBuyQues',
      required: true,
    },
    ref_product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    information: [
      {
        ques: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    payment: {
      paypal: { type: String },
      bank: { type: String },
    },
    state: {
      type: String,
      enum: ['pending', 'confirm', 'cancel'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const TradeIn = model<TTradeIn>('TradeIn', tradeInSchema);

export default TradeIn;
