import { Schema, model } from 'mongoose';
import { TProduct } from './Product.interface';
import slugify from 'slugify';

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

const generateProductSlug = (product: any): string => {
  const fields = [
    product.name,
    product.memory,
    product.controller,
    product.product_type,
    product.brand,
    product.model,
    product.condition,
  ].filter(Boolean); // Remove empty values

  return slugify(fields.join('-'), { lower: true, strict: true });
};

// Middleware to generate or update slug before saving
productSchema.pre('validate', async function (next) {
  if (
    this.isModified('name') ||
    this.isModified('memory') ||
    this.isModified('controller') ||
    this.isModified('product_type') ||
    this.isModified('brand') ||
    this.isModified('model') ||
    this.isModified('condition') ||
    this.isModified('slug')
  ) {
    const baseSlug = generateProductSlug(this);
    let newSlug = baseSlug;

    let existingProduct = await Product.findOne({ slug: newSlug });
    let counter = 2;

    while (
      existingProduct &&
      existingProduct._id.toString() !== this._id.toString()
    ) {
      newSlug = `${baseSlug}-${counter}`;
      existingProduct = await Product.findOne({ slug: newSlug });
      counter++;
    }

    this.slug = newSlug;
  }
  next();
});

const Product = model<TProduct>('Product', productSchema);

export default Product;
