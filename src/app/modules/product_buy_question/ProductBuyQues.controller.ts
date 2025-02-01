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
   *                                           L I N E   B R A C K                                           *
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
   *                                           L I N E   B R A C K                                           *
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

  // async updateOption(req: Request, res: Response) {
  //   try {
  //     const { productId, questionId, optionId } = req.params;
  //     const { option, price } = req.body; // Assuming body contains the updated option and price

  //     const updatedProduct = await productService.updateOptionInQuestion(
  //       productId,
  //       questionId,
  //       optionId,
  //       option,
  //       price,
  //     );

  //     res.status(200).json(updatedProduct);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // },

  // async deleteOption(req: Request, res: Response) {
  //   try {
  //     const { productId, questionId, optionId } = req.params;

  //     const updatedProduct = await productService.deleteOptionFromQuestion(
  //       productId,
  //       questionId,
  //       optionId,
  //     );

  //     res.status(200).json(updatedProduct);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // },
};
