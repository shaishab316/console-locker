import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './Product.service';
import catchAsync, { catchAsyncWithCallback } from '../../../shared/catchAsync';
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

  retrieve: catchAsyncWithCallback(async (req, res) => {
    const { meta, product, relatedProducts } = await ProductService.retrieve(
      req.params.slug as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product has retrieved successfully',
      data: {
        meta,
        product,
        relatedProducts,
      },
    });
  }),

  retrieveByIds: catchAsync(async (req, res) => {
    const ids = (req.query as { ids: string })?.ids
      ?.split(',')
      ?.map((id: string) => id?.trim())
      .filter(Boolean);

    const { products, variants } = await ProductService.retrieveByIds(ids);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Products retrieved successfully',
      data: { products, variants },
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

  listByName: catchAsync(async (req, res) => {
    const data = await ProductService.listByName(req.params.productName);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Slug find successfully',
      data,
    });
  }),
};
