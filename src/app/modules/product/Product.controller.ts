import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './Product.service';
import catchAsync, { catchAsyncWithCallback } from '../../../shared/catchAsync';
import unlinkFile from '../../../shared/unlinkFile';
import { ErrorRequestHandler } from 'express';
import ApiError from '../../../errors/ApiError';

/** Middleware to ensure image rollbacks if an error occurs during the request handling */
const imagesUploadRollback: ErrorRequestHandler = (err, req, _res, next) => {
  if (req.files && 'images' in req.files && Array.isArray(req.files.images))
    req.files.images.forEach(({ filename }) =>
      unlinkFile(`/images/${filename}`),
    );

  next(err);
};

export const ProductController = {
  /** for admin */
  createProduct: catchAsyncWithCallback(async (req, res) => {
    const images: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        images.push(`/images/${filename}`),
      );

    req.body.images = images;

    const newProduct = await ProductService.createProduct({
      ...req.body,
      admin: req.admin!._id,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product has created successfully!',
      data: newProduct,
    });
  }, imagesUploadRollback),

  updateProduct: catchAsyncWithCallback(async (req, res) => {
    const newImages: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        newImages.push(`/images/${filename}`),
      );

    if (newImages.length) req.body.images = newImages;

    const updatedProduct = await ProductService.updateProduct(
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

  deleteProduct: catchAsync(async (req, res) => {
    const deletedProduct = await ProductService.deleteProduct(req.params.id);

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

    const newProduct = await ProductService.createVariant(
      req.params.productId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product variant has created successfully!',
      data: newProduct,
    });
  }, imagesUploadRollback),

  updateVariant: catchAsyncWithCallback(async (req, res) => {
    const { productId, variantId } = req.params;
    const variantData = req.body;

    const newImages: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images)) {
      req.files.images.forEach(({ filename }) =>
        newImages.push(`/images/${filename}`),
      );
    }

    if (newImages.length) variantData.images = newImages;

    const updatedVariant = await ProductService.updateVariant(
      productId,
      variantId,
      variantData,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Variant updated successfully!',
      data: updatedVariant,
    });
  }, imagesUploadRollback),

  deleteVariant: catchAsync(async (req, res) => {
    const { productId, variantId } = req.params;

    const deletedVariant = await ProductService.deleteVariant(
      productId,
      variantId,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Variant deleted successfully',
      data: deletedVariant,
    });
  }),

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R A C K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  /** for user */

  retrieveProducts: catchAsync(async (req, res) => {
    const data = await ProductService.retrieveProducts(
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Products retrieved successfully',
      data,
    });
  }),

  retrieveSingleProduct: catchAsyncWithCallback(
    async (req, res) => {
      const data = await ProductService.retrieveSingleProduct(
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
};
