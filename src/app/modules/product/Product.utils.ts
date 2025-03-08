import { Document } from 'mongoose';
import { TProduct } from './Product.interface';
import slugify from 'slugify';
import {
  productModifiedFields as modifiedFields,
  productMergedFields as mergedFields,
} from './Product.constant';

export const mergeProducts = (products: (TProduct & { _doc?: any })[]) => {
  const mergedProducts: Record<string, any> = {};

  products.forEach(product => {
    const name = product.name;

    if (!mergedProducts[name])
      mergedProducts[name] = initializeProduct(product);
    else mergeProductData(mergedProducts[name], product);
  });

  return Object.values(mergedProducts);
};

export const isProductModified = (doc: Document) =>
  modifiedFields.some(key => doc.isModified(key));

export const generateProductSlug = (product: TProduct) => {
  const slug = modifiedFields
    .map(key => product[key as keyof TProduct])
    .filter(Boolean)
    .join('-');

  return slugify(slug, { lower: true, strict: true });
};

const initializeProduct = (product: TProduct & { _doc?: any }) => ({
  ...product._doc,
  ...mergedFields.reduce(
    (acc, field) => {
      const value = product[field as keyof TProduct];
      acc[field] = value ? [value] : [];
      return acc;
    },
    {} as Record<string, any[]>,
  ),
});

const mergeProductData = (existingProduct: any, newProduct: TProduct) =>
  mergedFields.forEach(field =>
    addUnique(existingProduct[field], newProduct[field as keyof TProduct]),
  );

const addUnique = (arr: any[], value: any) =>
  !!value && !arr.includes(value) && arr.push(value);
