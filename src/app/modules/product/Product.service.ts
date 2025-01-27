import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TProduct } from './Product.interface';
import Product from './Product.model';
import { Types } from 'mongoose';
import unlinkFile from '../../../shared/unlinkFile';

export const ProductService = {
  /** for admin */
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

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R A C K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  /** for users */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  async retrieveProduct(query: Record<string, string>) {
    const {
      product_type,
      brand,
      sort = 'max_price',
      page = 1,
      limit = 5,
    } = query;

    const matchConditions: Record<string, string> = {};
    if (product_type) matchConditions.product_type = product_type;
    if (brand) matchConditions.brand = brand;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder: Record<string, 1 | -1> =
      sort === 'max_price' ? { price: -1 } : { price: 1 };

    const result = await Product.aggregate([
      {
        $match: matchConditions,
      },
      {
        $facet: {
          products: [
            { $sort: sortOrder },
            { $skip: skip },
            { $limit: Number(limit) },
          ],
          meta: [
            {
              $group: {
                _id: null,
                max_price: { $max: '$price' },
                min_price: { $min: '$price' },
                product_types: {
                  $push: '$product_type',
                },
                brands: {
                  $push: '$brand',
                },
                conditions: {
                  $push: '$condition',
                },
                totalCount: { $sum: 1 },
              },
            },
            {
              $project: {
                max_price: 1,
                min_price: 1,
                totalCount: 1,
                totalPages: {
                  $ceil: { $divide: ['$totalCount', Number(limit)] },
                },
                currentPage: Number(page),
                product_types: {
                  $filter: {
                    input: {
                      $map: {
                        input: { $setUnion: ['$product_types', [null]] },
                        as: 'type',
                        in: {
                          name: '$$type',
                          count: {
                            $size: {
                              $filter: {
                                input: '$product_types',
                                as: 'typeItem',
                                cond: { $eq: ['$$typeItem', '$$type'] },
                              },
                            },
                          },
                        },
                      },
                    },
                    as: 'typeData',
                    cond: { $gt: ['$$typeData.count', 0] }, // Exclude items with count 0
                  },
                },
                brands: {
                  $filter: {
                    input: {
                      $map: {
                        input: { $setUnion: ['$brands', [null]] },
                        as: 'brand',
                        in: {
                          name: '$$brand',
                          count: {
                            $size: {
                              $filter: {
                                input: '$brands',
                                as: 'brandItem',
                                cond: { $eq: ['$$brandItem', '$$brand'] },
                              },
                            },
                          },
                        },
                      },
                    },
                    as: 'brandData',
                    cond: { $gt: ['$$brandData.count', 0] }, // Exclude items with count 0
                  },
                },
                conditions: {
                  $filter: {
                    input: {
                      $map: {
                        input: { $setUnion: ['$conditions', [null]] },
                        as: 'condition',
                        in: {
                          name: '$$condition',
                          count: {
                            $size: {
                              $filter: {
                                input: '$conditions',
                                as: 'conditionItem',
                                cond: {
                                  $eq: ['$$conditionItem', '$$condition'],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    as: 'conditionData',
                    cond: { $gt: ['$$conditionData.count', 0] }, // Exclude items with count 0
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          products: 1,
          meta: { $arrayElemAt: ['$meta', 0] },
        },
      },
    ]);

    const products = result[0]?.products || [];
    const meta = result[0]?.meta || {};

    return {
      products,
      meta,
    };
  },
};
