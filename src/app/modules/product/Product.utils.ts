import { Document } from 'mongoose';
import { TProduct } from './Product.interface';
import slugify from 'slugify';
import { productModifiedFields as fields } from './Product.constant';

export const mergeProducts = (products: (TProduct & { _doc?: any })[]) => {
  const mergedProducts: Record<any, any> = {};

  products.forEach(product => {
    // If the product name already exists in the merged products object, combine the data
    if (mergedProducts[product.name]) {
      const existingProduct = mergedProducts[product.name];

      // Merge product fields into arrays
      existingProduct.model.push(product.model);
      existingProduct.condition.push(product.condition);
      existingProduct.controller.push(product.controller);
      existingProduct.memory.push(product.memory);
      existingProduct.quantity += product.quantity; // Sum quantities
    } else {
      // If the product doesn't exist, just add it to the merged products object
      mergedProducts[product.name] = {
        ...product._doc,
        model: [product.model],
        condition: [product.condition],
        controller: [product.controller],
        memory: [product.memory],
      };
    }
  });

  // Convert merged products object back to an array
  return Object.values(mergedProducts);
};

export const isProductModified = (doc: Document) =>
  fields.some(key => doc.isModified(key));

export const generateProductSlug = (product: TProduct) => {
  const slug = fields
    .map(key => product[key as keyof TProduct])
    .filter(Boolean)
    .join('-');

  return slugify(slug, { lower: true, strict: true });
};
