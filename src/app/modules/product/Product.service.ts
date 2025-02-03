import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TProduct } from './Product.interface';
import Product from './Product.model';
import { PipelineStage } from 'mongoose';
import { mergeProducts } from './Product.utils';
import deleteFile from '../../../shared/deleteFile';

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
    if (updateData.images && updateData.images.length > 0)
      imagesToDelete.forEach(async (image: string) => await deleteFile(image));

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
    if (!product || product.isVariant) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    variantData.isVariant = true;
    variantData.product_ref = product._id;

    if (!variantData.product_type)
      variantData.product_type = product.product_type;

    const newVariant = await Product.create(variantData);

    return newVariant;
  },

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  /** for users */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  async retrieveProducts(query: Record<string, string>) {
    const {
      product_type: productType,
      brand,
      sort = 'max_price',
      page = '1',
      limit = '5',
      search,
      min_price: minPrice,
      max_price: maxPrice,
    } = query;

    // Helper to parse numbers safely with a default fallback
    const parseNumber = (value: string, fallback: number) =>
      !isNaN(Number(value)) ? Number(value) : fallback;

    const parsedPage = parseNumber(page, 1);
    const parsedLimit = parseNumber(limit, 5);

    // Construct filters for MongoDB query
    const filters: Record<string, any> = {};
    const filtersForPrice: Record<string, any> = {};

    if (productType) {
      filters.product_type = productType;
      filtersForPrice.product_type = productType;
    }
    if (brand) {
      filters.brand = brand;
      filtersForPrice.brand = brand;
    }

    // Add price range filtering
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseNumber(minPrice, 0); // Greater than or equal to minPrice
      if (maxPrice)
        filters.price.$lte = parseNumber(maxPrice, Number.MAX_SAFE_INTEGER); // Less than or equal to maxPrice
    }

    // Add search functionality for product_type and brand
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      filters.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Determine sorting order
    const sortField: Record<string, 1 | -1> =
      sort === 'max_price' ? { price: -1 } : { price: 1 };

    // Calculate skip value for pagination
    const skip = (parsedPage - 1) * parsedLimit;

    // Define aggregation pipelines for products, product types, brands, and conditions
    const createPipeline = {
      products: (): PipelineStage[] => [
        { $match: filters },
        { $group: { _id: '$name', product: { $first: '$$ROOT' } } },
        { $sort: sortField },
        { $skip: skip },
        { $limit: parsedLimit },
        {
          $project: {
            _id: 0,
            name: '$_id',
            product: 1,
          },
        },
      ],
      productTypes: (): PipelineStage[] => [
        { $group: { _id: '$product_type' } },
        {
          $project: {
            _id: 0,
            productType: '$_id',
          },
        },
      ],
      brands: (): PipelineStage[] => [
        { $match: productType ? { product_type: productType } : {} },
        { $group: { _id: '$brand' } },
        {
          $project: {
            _id: 0,
            brand: '$_id',
          },
        },
      ],
      conditions: (): PipelineStage[] => [
        { $match: filters },
        { $group: { _id: '$condition' } },
        {
          $project: {
            _id: 0,
            condition: '$_id',
          },
        },
      ],
    };

    // Fetch min and max price dynamically
    const priceRangePipeline: PipelineStage[] = [
      { $match: filtersForPrice },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ];

    // Fetch data in parallel for better performance
    const [
      productsResult,
      productTypesResult,
      brandsResult,
      conditionsResult,
      priceRangeResult,
    ] = await Promise.all([
      Product.aggregate(createPipeline.products()),
      Product.aggregate(createPipeline.productTypes()),
      Product.aggregate(createPipeline.brands()),
      Product.aggregate(createPipeline.conditions()),
      Product.aggregate(priceRangePipeline),
    ]);

    // Extract results
    const products = productsResult.map(item => item.product);
    const productTypes = productTypesResult.map(item => item.productType);
    const brands = brandsResult.map(item => item.brand);
    const conditions = conditionsResult.map(item => item.condition);

    const dynamicMinPrice = priceRangeResult[0]?.minPrice || 0;
    const dynamicMaxPrice = priceRangeResult[0]?.maxPrice || 0;

    // Calculate total count
    const totalCountResult = await Product.aggregate([
      { $match: filters },
      { $group: { _id: '$name' } },
      { $count: 'total' },
    ]);
    const totalCount = totalCountResult[0]?.total || 0;

    // Return structured response
    return {
      products,
      meta: {
        pagination: {
          total_product_count: totalCount,
          total_pages: Math.ceil(totalCount / parsedLimit),
          current_page: parsedPage,
          current_product_limit: parsedLimit,
        },
        product_meta: {
          product_types: productTypes,
          brands,
          conditions,
          min_price: dynamicMinPrice,
          max_price: dynamicMaxPrice,
        },
        current: {
          product_type: productType || null,
          brand: brand || null,
          condition: query.condition || null,
          search: search || null,
          min_price: +minPrice || dynamicMinPrice,
          max_price: +maxPrice || dynamicMaxPrice,
        },
      },
    };
  },

  async retrieveSingleProduct(params: Record<string, string>) {
    const products = await Product.find({
      product_type: params.productType,
      brand: params.brand,
      name: params.productName,
    }).select('-variants');

    // Merge products by name
    const mergedProducts = mergeProducts(products)[0];

    // Uniquify specific fields and rename to plural forms
    mergedProducts.models = [...new Set(mergedProducts.model)];
    mergedProducts.controllers = [...new Set(mergedProducts.controller)];
    mergedProducts.conditions = [...new Set(mergedProducts.condition)];
    mergedProducts.memories = [...new Set(mergedProducts.memory)];

    // Optionally, remove the original singular fields if not needed
    delete mergedProducts.model;
    delete mergedProducts.controller;
    delete mergedProducts.condition;
    delete mergedProducts.memory;

    return mergedProducts;
  },

  async calculateProductPrice(
    params: Record<string, string>,
    query: Record<string, string>,
  ) {
    const { _id, offer_price, price } = (await Product.findOne({
      product_type: params.productType,
      brand: params.brand,
      name: params.productName,
      memory: query.memory,
      condition: query.condition,
      controller: query.controller,
      model: query.model,
    }).select('price offer_price')) as TProduct;

    return {
      productId: _id,
      price: offer_price ?? price,
    };
  },
};
