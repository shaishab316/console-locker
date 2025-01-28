import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TProduct } from './Product.interface';
import Product from './Product.model';
import { PipelineStage, Types } from 'mongoose';
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
      product_type: productType,
      brand,
      sort = 'max_price',
      page = 1,
      limit = 5,
    } = query;

    const filters: Record<string, string> = {};
    if (productType) filters.product_type = productType;
    if (brand) filters.brand = brand;

    const skip = (Number(page) - 1) * Number(limit);

    // Ensure sort is dynamically applied based on the field name
    const sortField: Record<string, 1 | -1> =
      sort === 'max_price' ? { price: -1 } : { price: 1 };

    const productPipeline: PipelineStage[] = [
      { $match: filters },
      {
        $group: {
          _id: '$name',
          product: { $first: '$$ROOT' },
        },
      },
      { $sort: sortField },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $project: {
          _id: 0,
          name: '$_id',
          product: 1,
        },
      },
    ];

    const productTypePipeline: PipelineStage[] = [
      {
        $group: {
          _id: '$product_type',
        },
      },
      {
        $project: {
          _id: 0,
          productType: '$_id',
        },
      },
    ];

    const brandPipeline: PipelineStage[] = [
      { $match: productType ? { product_type: productType } : {} },
      {
        $group: {
          _id: '$brand',
        },
      },
      {
        $project: {
          _id: 0,
          brand: '$_id',
        },
      },
    ];

    const conditionPipeline: PipelineStage[] = [
      { $match: filters },
      {
        $group: {
          _id: '$condition',
        },
      },
      {
        $project: {
          _id: 0,
          condition: '$_id',
        },
      },
    ];

    const [productsResult, productTypesResult, brandsResult, conditionsResult] =
      await Promise.all([
        Product.aggregate(productPipeline),
        Product.aggregate(productTypePipeline),
        Product.aggregate(brandPipeline),
        Product.aggregate(conditionPipeline),
      ]);

    const products = productsResult.map(item => item.product);
    const productTypes = productTypesResult.map(item => item.productType);
    const brands = brandsResult.map(item => item.brand);
    const conditions = conditionsResult.map(item => item.condition);

    const totalCountResult = await Product.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$name',
        },
      },
      { $count: 'total' },
    ]);

    const totalCount = totalCountResult[0]?.total || 0;

    return {
      products,
      meta: {
        totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
        currentPage: Number(page),
        productTypes,
        brands,
        conditions,
        current: {
          productType: query.product_type || null, // Current product type, or null if not specified
          brand: query.brand || null, // Current brand, or null if not specified
          condition: query.condition || null, // Current condition, or null if not specified
        },
      },
    };
  },
};
