import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TProduct } from './Product.interface';
import Product from './Product.model';
import { PipelineStage } from 'mongoose';
import { mergeProducts } from './Product.utils';
import deleteFile from '../../../shared/deleteFile';
import Review from '../review/Review.model';

export const ProductService = {
  /** for admin */
  async create(newProduct: TProduct) {
    return await Product.create(newProduct);
  },

  async update(productId: string, updateData: Partial<TProduct>) {
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

  async delete(productId: string) {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    // delete product images
    deletedProduct.images.forEach(
      async (image: string) => await deleteFile(image),
    );

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
  async list(query: Record<string, string>) {
    const {
      product_type: productType,
      brand,
      sort = '',
      page = '1',
      limit = '5',
      search,
      min_price: minPrice,
      max_price: maxPrice,
    } = query;

    // Helper to parse numbers safely with a default fallback
    const parseNumber = (value: string | undefined, fallback: number) =>
      value !== undefined && !isNaN(Number(value)) ? Number(value) : fallback;

    const parsedPage = parseNumber(page, 1);
    const parsedLimit = parseNumber(limit, 5);
    const parsedMinPrice = parseNumber(minPrice, 0);
    const parsedMaxPrice = parseNumber(maxPrice, Number.MAX_SAFE_INTEGER);

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

    // Price filter considering offer_price
    if (minPrice || maxPrice) {
      filters.$expr = {
        $and: [],
      };

      if (minPrice) {
        filters.$expr.$and.push({
          $gte: [
            { $ifNull: ['$offer_price', '$price'] },
            parsedMinPrice, // Ensure type is number
          ],
        });
      }

      if (maxPrice) {
        filters.$expr.$and.push({
          $lte: [
            { $ifNull: ['$offer_price', '$price'] },
            parsedMaxPrice, // Ensure type is number
          ],
        });
      }
    }

    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filters.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Pagination logic
    const skip = (parsedPage - 1) * parsedLimit;

    // Aggregation pipeline for price range (considering offer_price)
    const priceRangePipeline: PipelineStage[] = [
      { $match: filtersForPrice },
      {
        $group: {
          _id: null,
          minPrice: { $min: { $ifNull: ['$offer_price', '$price'] } },
          maxPrice: { $max: { $ifNull: ['$offer_price', '$price'] } },
        },
      },
    ];

    // Execute queries concurrently
    const [
      productsResult,
      productTypesResult,
      brandsResult,
      conditionsResult,
      priceRangeResult,
    ] = await Promise.all([
      Product.aggregate([
        { $match: filters },
        { $group: { _id: '$name', product: { $first: '$$ROOT' } } },
        { $skip: skip },
        { $limit: parsedLimit },
        { $project: { _id: 0, name: '$_id', product: 1 } },
      ]),
      Product.aggregate([
        { $group: { _id: '$product_type' } },
        { $project: { _id: 0, productType: '$_id' } },
      ]),
      Product.aggregate([
        { $match: productType ? { product_type: productType } : {} },
        { $group: { _id: '$brand' } },
        { $project: { _id: 0, brand: '$_id' } },
      ]),
      Product.aggregate([
        { $match: filters },
        { $group: { _id: '$condition' } },
        { $project: { _id: 0, condition: '$_id' } },
      ]),
      Product.aggregate(priceRangePipeline),
    ]);

    // Extract results
    const products = productsResult.map(item => item.product);
    const productTypes = productTypesResult.map(item => item.productType);
    const brands = brandsResult.map(item => item.brand);
    const conditions = conditionsResult.map(item => item.condition);

    const dynamicMinPrice = priceRangeResult[0]?.minPrice ?? 0;
    const dynamicMaxPrice = priceRangeResult[0]?.maxPrice ?? 0;

    // **Manually sort products**
    if (sort === 'max_price')
      products.sort(
        (a, b) => (b.offer_price ?? b.price) - (a.offer_price ?? a.price),
      );
    else if (sort === 'min_price')
      products.sort(
        (a, b) => (a.offer_price ?? a.price) - (b.offer_price ?? b.price),
      );
    else
      products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

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
          min_price: parsedMinPrice || dynamicMinPrice,
          max_price: parsedMaxPrice || dynamicMaxPrice,
        },
      },
    };
  },

  async retrieveMeta(productName: string) {
    const products = await Product.find({ name: productName });

    // Merge products by name
    const mergedProducts = mergeProducts(products)[0];

    // Return only required fields with unique values
    return {
      models: [...new Set(mergedProducts.model)],
      controllers: [...new Set(mergedProducts.controller)],
      conditions: [...new Set(mergedProducts.condition)],
      memories: [...new Set(mergedProducts.memory)],
    };
  },

  async retrieve(slug: string) {
    const product = await Product.findOne({ slug }).lean();

    if (!product)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');

    const meta = await this.retrieveMeta(product.name!);
    const reviews = await this.getReviews(product.name!);
    const relatedProducts = await this.relatedProducts(product.brand!);

    Object.assign(product, reviews);

    return { product, meta, relatedProducts };
  },

  async findSlug(filter: Partial<TProduct>) {
    const product = await Product.findOne(filter).select('slug');

    if (!product)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');

    return product.slug;
  },

  async getReviews(productName: string) {
    const reviews = await Review.aggregate([
      { $match: { product: productName } },
      {
        $group: {
          _id: '$product',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return {
      ratings: +reviews?.[0]?.avgRating?.toFixed(1) || 0,
      reviewCount: +reviews?.[0]?.totalReviews || 0,
    };
  },

  async relatedProducts(brand: string) {
    const products = await Product.find({ brand }).limit(4).lean();

    return products;
  },
};
