import { Types } from 'mongoose';
import { TBuyQues, TProductBuyQues } from './ProductBuyQues.interface';
import ProductBuyQues from './ProductBuyQues.model';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

export const ProductBuyQuesService = {
  createQuestion: async (questionData: TProductBuyQues) =>
    await ProductBuyQues.create(questionData),

  async updateQuestion(id: string, updateData: Partial<TProductBuyQues>) {
    const updatedQuestion = await ProductBuyQues.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updatedQuestion) throw new Error('Product buy question not found!');

    return updatedQuestion;
  },

  async deleteQuestion(id: string) {
    const deletedQuestion = await ProductBuyQues.findByIdAndDelete(id);

    if (!deletedQuestion) throw new Error('Product buy question not found!');

    return deletedQuestion;
  },

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R A C K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  async addInnerQuestion(productId: string, questionData: TBuyQues) {
    // const newQuestion = { ...questionData };

    // Create the update object to push the new question into the 'questions' array
    const updatedProduct = await ProductBuyQues.findByIdAndUpdate(
      productId,
      {
        $push: { questions: questionData },
      },
      { new: true },
    );

    if (!updatedProduct) {
      throw new Error('Product not found!');
    }

    return updatedProduct;
  },

  async updateInnerQuestion(
    productId: string,
    questionId: string,
    questionData: Partial<TBuyQues>,
  ) {
    const updateData: Record<string, any> = {};

    if (questionData.name) updateData['questions.$.name'] = questionData.name;
    if (questionData.description)
      updateData['questions.$.description'] = questionData.description;

    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid fields to update');
    }

    const updatedProduct = await ProductBuyQues.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        'questions._id': new Types.ObjectId(questionId),
      },
      { $set: updateData },
      { new: true },
    );

    if (!updatedProduct) {
      throw new Error('Product or question not found!');
    }

    return updatedProduct;
  },

  async deleteInnerQuestion(productId: string, questionId: string) {
    const updatedProduct = await ProductBuyQues.findByIdAndUpdate(
      productId,
      {
        $pull: { questions: { _id: questionId } }, // Remove the inner question with the given ID
      },
      { new: true },
    );

    if (!updatedProduct) {
      throw new Error('Product or question not found!');
    }

    return updatedProduct;
  },

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R A C K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  async addOption(
    productId: string,
    questionId: string,
    option: string,
    price: number,
  ) {
    const newOption = { option, price };

    const updatedProduct = await ProductBuyQues.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        'questions._id': new Types.ObjectId(questionId),
        'questions.options.option': { $ne: option },
      },
      { $push: { 'questions.$.options': newOption } },
      { new: true },
    );

    if (!updatedProduct) throw new ApiError(StatusCodes.CONFLICT,'Something went wrong!');

    return updatedProduct;
  },

  // async updateOption(
  //   productId: string,
  //   questionId: string,
  //   optionId: string,
  //   option: string,
  //   price: number,
  // ) {
  //   const updatedProduct = await ProductBuyQues.findOneAndUpdate(
  //     {
  //       _id: new Types.ObjectId(productId),
  //       'questions._id': new Types.ObjectId(questionId),
  //       'questions.options._id': new Types.ObjectId(optionId),
  //     },
  //     {
  //       $set: {
  //         'questions.$.options.$[opt].option': option,
  //         'questions.$.options.$[opt].price': price,
  //       },
  //     },
  //     {
  //       arrayFilters: [{ 'opt._id': new Types.ObjectId(optionId) }],
  //       new: true,
  //     },
  //   );

  //   if (!updatedProduct)
  //     throw new Error('Product, question, or option not found!');

  //   return updatedProduct;
  // },

  // async deleteOption(productId: string, questionId: string, optionId: string) {
  //   const updatedProduct = await ProductBuyQues.findOneAndUpdate(
  //     {
  //       _id: new Types.ObjectId(productId),
  //       'questions._id': new Types.ObjectId(questionId),
  //     },
  //     {
  //       $pull: { 'questions.$.options': { _id: new Types.ObjectId(optionId) } },
  //     },
  //     { new: true },
  //   );

  //   if (!updatedProduct)
  //     throw new Error('Product, question, or option not found!');

  //   return updatedProduct;
  // },
};
