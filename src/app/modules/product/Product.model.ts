import { Schema, model } from 'mongoose';
import { TProduct } from './Product.interface';

const productSchema = new Schema<TProduct>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  offer_price: Number,
  brand: {
    type: String,
  },
  model: {
    type: String,
  },
  condition: {
    type: String,
    enum: ['fair', 'good', 'excellent'],
    required: true,
  },
  controller: {
    type: Number,
  },
  memory: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  isVariant: {
    type: Boolean,
    default: false,
  },
  product_type: {
    type: String,
    required: true,
  },
  product_ref: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const Product = model('Product', productSchema);

export default Product;
