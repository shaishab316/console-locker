import { Schema, model } from 'mongoose';
import { TProduct } from './Product.interface';

const productSchema = new Schema<TProduct>({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: (images: string[]) => images.length > 0,
      message: 'Images array cannot be empty.',
    },
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
  },
  controller: {
    type: String,
  },
  memory: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  isVariant: {
    type: Boolean,
    default: false,
  },
  product_type: {
    type: String,
  },
  product_ref: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const Product = model('Product', productSchema);

export default Product;
