import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './Product.service';
import catchAsync, { catchAsyncWithCallback } from '../../../shared/catchAsync';
import unlinkFile from '../../../shared/unlinkFile';

export const ProductController = {
  createProduct: catchAsyncWithCallback(
    async (req, res) => {
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
    },
    (err, req, _res, next) => {
      req.body.images.forEach((image: string) => unlinkFile(image));
      next(err);
    },
  ),

  updateProduct: catchAsync(async (req, res) => {
    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product has been updated successfully!',
      data: updatedProduct,
    });
  }),

  deleteProduct: catchAsync(async (req, res) => {
    const deletedProduct = await ProductService.deleteProduct(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product deleted successfully',
      data: deletedProduct,
    });
  }),

  updateVariant: catchAsync(async (req, res) => {
    const { productId, variantId } = req.params;
    const variantData = req.body;

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
  }),
};
