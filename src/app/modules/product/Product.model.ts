import { Schema, model } from 'mongoose';
import { TProduct } from './Product.interface';
import { injectProductModelMiddlewares } from './Product.middleware';
const productSchema = new Schema<TProduct>({
  slug: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
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
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offer_price: Number,
  brand: {
    type: String,
    trim: true,
  },
  model: {
    type: String,
    trim: true,
  },
  condition: {
    type: String,
    trim: true,
  },
  controller: {
    type: String,
    trim: true,
  },
  memory: {
    type: String,
    trim: true,
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
    trim: true,
  },
  product_ref: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
    default: Number.MAX_SAFE_INTEGER,
  },

  modelDes: String,
  conditionDes: String,
  controllerDes: String,
  memoryDes: String,

  modelLabel: {
    type: String,
    default: 'Select Model',
  },
  conditionLabel: {
    type: String,
    default: 'Select Condition',
  },
  controllerLabel: {
    type: String,
    default: 'Select Controller',
  },
  memoryLabel: {
    type: String,
    default: 'Select Memory',
  },
  relatedProducts: {
    type: [String],
    default: [],
    trim: true,
  },
  specifications: String,
});

injectProductModelMiddlewares(productSchema);

const Product = model<TProduct>('Product', productSchema);

export default Product;
