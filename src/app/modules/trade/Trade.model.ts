import { Schema, model } from 'mongoose';
import { TTrade } from './Trade.interface';

const tradeSchema = new Schema<TTrade>({
  price: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  memory: {
    type: String,
    required: true,
  },
  product_type: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const Trade = model('Trade', tradeSchema);

export default Trade;
