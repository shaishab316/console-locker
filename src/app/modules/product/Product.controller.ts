import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './Product.service';

export const ProductController = {
  createProduct: catchAsync(async (req, res) => {
    const newProduct = await ProductService.createProduct({
      ...req.body,
      admin: req.admin._id,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product has created successfully!',
      data: newProduct,
    });
  }),
};
