import { model, Schema } from 'mongoose';
import { TProductBuy } from './ProductBuy.interface';

const productBuySchema = new Schema<TProductBuy>(
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
    information: [
      {
        ques: { type: String, required: true },
        option: { type: String, required: true },
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
  },
  { timestamps: true },
);

const ProductBuy = model<TProductBuy>('ProductBuy', productBuySchema);

export default ProductBuy;
