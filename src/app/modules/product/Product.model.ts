import { Schema, model } from 'mongoose';
import { TProduct } from './Product.interface';

const ProductSchema = new Schema<TProduct>({
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
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offer_price: Number,
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ['fair', 'good', 'excellent'],
    required: true,
  },
  controller: {
    type: Number,
    required: true,
  },
  memory: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  variants: {
    type: [
      {
        images: [String],
        name: String,
        price: Number,
        offer_price: Number,
        brand: String,
        condition: {
          type: String,
          enum: ['fair', 'good', 'excellent'],
        },
        quantity: Number,
      },
    ],
    default: [],
  },
  product_type: {
    type: String,
    required: true,
  },
});

const Product = model('Product', ProductSchema);

export default Product;
