import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TProduct } from './Product.interface';
import Product from './Product.model';
import { Types } from 'mongoose';
import unlinkFile from '../../../shared/unlinkFile';

export const ProductService = {
  async createProduct(newProduct: TProduct) {
    return await Product.create(newProduct);
  },

  async updateProduct(productId: string, updateData: Partial<TProduct>) {
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    const imagesToDelete = existingProduct.images || [];

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true },
    );

    // Delete old images if new images were uploaded
    if (updateData.images && updateData.images.length > 0) {
      imagesToDelete.forEach((image: string) => unlinkFile(image));
    }

    return updatedProduct;
  },

  async deleteProduct(productId: string) {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    return deletedProduct;
  },

  async createVariant(productId: string, variantData: Partial<TProduct>) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    const newVariant = {
      ...variantData,
      _id: new Types.ObjectId(),
    };

    product.variants = product.variants || [];
    product.variants.push(newVariant);

    await product.save();
    return newVariant;
  },

  async updateVariant(
    productId: string,
    variantId: string,
    variantData: Partial<TProduct>,
  ) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    const variant = product.variants?.find(
      v => v._id!.toString() === variantId,
    );

    if (!variant) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Variant not found');
    }

    // Update the variant's fields
    Object.assign(variant, variantData);

    await product.save();

    return variant;
  },

  async deleteVariant(productId: string, variantId: string) {
    const product = await Product.findById(productId);
    if (!product)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');

    const variantIndex = product.variants?.findIndex(
      v => v._id!.toString() === variantId,
    );

    if (variantIndex === undefined || variantIndex === -1)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Variant not found');

    // Remove the variant from the product
    const deletedVariant = product.variants!.splice(variantIndex, 1);

    await product.save();

    return deletedVariant;
  },
};
