import { Schema } from 'mongoose';
import { generateProductSlug, isProductModified } from './Product.utils';
import Product from './Product.model';
import { TProduct } from './Product.interface';

export const injectProductModelMiddlewares = (schema: Schema<TProduct>) => {
  /**
   * Middleware to generate or update slug before saving
   */
  schema.pre('validate', async function (next) {
    if (!isProductModified(this)) return next();

    const baseSlug = generateProductSlug(this);
    let newSlug = baseSlug,
      counter = 2;

    /** Check if slug exists and increment  */
    while (await Product.countDocuments({ slug: newSlug }))
      newSlug = `${baseSlug}-${counter++}`;

    this.slug = newSlug;

    next();
  });
};
