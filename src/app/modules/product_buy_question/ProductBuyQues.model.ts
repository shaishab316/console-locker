import { model, Schema } from 'mongoose';
import { TBuyQues, TProductBuyQues } from './ProductBuyQues.interface';

const optionSchema = new Schema({
  option: { type: String, required: true },
  price: { type: Number, required: true },
});

const buyQuesSchema = new Schema<TBuyQues>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  options: { type: [optionSchema], required: true },
});

const productBuyQuesSchema = new Schema<TProductBuyQues>({
  image: { type: String, required: true },
  name: { type: String, required: true },
  base_price: { type: Number, required: true },
  questions: { type: [buyQuesSchema], required: true },
});

const ProductBuyQues = model<TProductBuyQues>(
  'ProductBuyQues',
  productBuyQuesSchema,
);

export default ProductBuyQues;
