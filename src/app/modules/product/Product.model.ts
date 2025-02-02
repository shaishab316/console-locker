import { Schema, model } from 'mongoose';
import { TProduct } from './Product.interface';
import Admin from '../admin/Admin.model';

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

productSchema.pre('save', async function (next) {
  if (!this.admin) {
    const admin = await Admin.findOne().select('_id');
    this.admin = admin!._id;
  }
  next();
});

const Product = model('Product', productSchema);

export default Product;
