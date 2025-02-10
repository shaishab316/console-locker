import { StatusCodes } from 'http-status-codes';
import catchAsync, { catchAsyncWithCallback } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductBuyQuesService } from './ProductBuyQues.service';
import { imagesUploadRollback } from '../../middlewares/imageUploader';

export const ProductBuyQuesController = {
  createQuestion: catchAsyncWithCallback(async (req, res) => {
    const images: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        images.push(`/images/${filename}`),
      );

    req.body.image = images[0];

    const newQuestion = await ProductBuyQuesService.createQuestion(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product buy question has been created successfully!',
      data: newQuestion,
    });
  }, imagesUploadRollback),

  updateQuestion: catchAsyncWithCallback(async (req, res) => {
    const { id } = req.params;
    const images: string[] = [];

    if (req.files && 'images' in req.files && Array.isArray(req.files.images))
      req.files.images.forEach(({ filename }) =>
        images.push(`/images/${filename}`),
      );

    if (images.length > 0) {
      req.body.image = images[0];
    }

    const updatedQuestion = await ProductBuyQuesService.updateQuestion(
      id,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product buy question has been updated successfully!',
      data: updatedQuestion,
    });
  }, imagesUploadRollback),

  deleteQuestion: catchAsyncWithCallback(async (req, res) => {
    const { id } = req.params;
    const result = await ProductBuyQuesService.deleteQuestion(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product buy question has been deleted successfully!',
      data: result,
    });
  }),

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  addInnerQuestion: catchAsyncWithCallback(async (req, res) => {
    const { id } = req.params;
    const questionData = req.body;

    const result = await ProductBuyQuesService.addInnerQuestion(
      id,
      questionData,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'New Question added successfully!',
      data: result,
    });
  }),

  updateInnerQuestion: catchAsyncWithCallback(async (req, res) => {
    const { id, quesId } = req.params;
    const questionData = req.body;

    const result = await ProductBuyQuesService.updateInnerQuestion(
      id,
      quesId,
      questionData,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Question has been updated successfully!',
      data: result,
    });
  }),

  deleteInnerQuestion: catchAsyncWithCallback(async (req, res) => {
    const { id, quesId } = req.params;

    const result = await ProductBuyQuesService.deleteInnerQuestion(id, quesId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Inner question has been deleted successfully!',
      data: result,
    });
  }),

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  addOption: catchAsync(async (req, res) => {
    const { id, quesId } = req.params;
    const { option, price } = req.body;

    const updatedProduct = await ProductBuyQuesService.addOption(
      id,
      quesId,
      option,
      price,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'New option added successfully!',
      data: updatedProduct,
    });
  }),

  updateOption: catchAsync(async (req, res) => {
    const { id, quesId, optionId } = req.params;
    const { option, price } = req.body;

    const updatedProduct = await ProductBuyQuesService.updateOption(
      id,
      quesId,
      optionId,
      option,
      price,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Option updated successfully!',
      data: updatedProduct,
    });
  }),

  deleteOption: catchAsync(async (req, res) => {
    const { id, quesId, optionId } = req.params;

    await ProductBuyQuesService.deleteOption(id, quesId, optionId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Option deleted successfully!',
    });
  }),

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  retrieveQuestion: catchAsync(async (req, res) => {
    const data = await ProductBuyQuesService.retrieveQuestion(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Sellable product retrieved successfully!',
      data,
    });
  }),

  retrieveSingleQuestion: catchAsync(async (req, res) => {
    const data = await ProductBuyQuesService.retrieveSingleQuestion(
      req.params.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product question retrieved successfully!',
      data,
    });
  }),

  calcPrice: catchAsync(async (req, res) => {
    const price = await ProductBuyQuesService.calcPrice(
      req.params.id,
      req.body.questions,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product price calculate successfully!',
      data: {
        price,
        productId: req.params.id,
      },
    });
  }),
};
