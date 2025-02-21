import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './Product.service';
import catchAsync, { catchAsyncWithCallback } from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiError';
import Product from './Product.model';
import { imagesUploadRollback } from '../../middlewares/imageUploader';

export const ProductController = {
  /** for admin */
  create: catchAsyncWithCallback(async (req, res) => {
    const images: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        images.push(`/images/${filename}`),
      );

    req.body.images = images;

    const newProduct = await ProductService.create({
      ...req.body,
      admin: req.admin!._id,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Product has created successfully!',
      data: newProduct,
    });
  }, imagesUploadRollback),

  update: catchAsyncWithCallback(async (req, res) => {
    const newImages: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        newImages.push(`/images/${filename}`),
      );

    if (newImages.length) req.body.images = newImages;

    const updatedProduct = await ProductService.update(
      req.params.productId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product has been updated successfully!',
      data: updatedProduct,
    });
  }, imagesUploadRollback),

  delete: catchAsync(async (req, res) => {
    const deletedProduct = await ProductService.delete(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product deleted successfully',
      data: deletedProduct,
    });
  }),

  createVariant: catchAsyncWithCallback(async (req, res) => {
    const images: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        images.push(`/images/${filename}`),
      );

    req.body.images = images;
    req.body.admin = req.admin?._id;

    const newVariant = await ProductService.createVariant(
      req.params.productId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product variant has created successfully!',
      data: newVariant,
    });
  }, imagesUploadRollback),

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  /** for user */

  list: catchAsync(async (req, res) => {
    const data = await ProductService.list(req.query as Record<string, string>);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Products retrieved successfully',
      data,
    });
  }),

  retrieveBySlug: catchAsyncWithCallback(async (req, res) => {
    const data = await ProductService.retrieveBySlug(req.params.slug as string);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product has retrieved successfully',
      data,
    });
  }),

  findSlug: catchAsync(async (req, res) => {
    const filter = {
      name: req.params.productName,
      model: req.query.model as string,
      condition: req.query.condition as string,
      memory: req.query.memory as string,
      controller: req.query.controller as string,
    };

    const slug = await ProductService.findSlug(filter);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Slug find successfully',
      data: { slug },
    });
  }),

  retrieve: catchAsyncWithCallback(
    async (req, res) => {
      const data = await ProductService.retrieve(
        req.params as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: req.params.productName + ' has retrieved successfully',
        data,
      });
    },
    (_err, _req, _res, next) => {
      next(new ApiError(StatusCodes.NOT_FOUND, 'Product not found.'));
    },
  ),

  calculateProductPrice: catchAsyncWithCallback(
    async (req, res) => {
      const data = await ProductService.calculateProductPrice(
        req.params as Record<string, string>,
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product price calculate successfully',
        data,
      });
    },
    async (_err, { params }, res) => {
      const product = await Product.findOne({
        product_type: params.productType,
        brand: params.brand,
        name: params.productName,
      }).select('model controller condition memory -_id');

      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'This product is out of stock.',
        data: { help: product },
      });
    },
  ),
};
