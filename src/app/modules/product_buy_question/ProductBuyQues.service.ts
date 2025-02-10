import { Types } from 'mongoose';
import { TBuyQues, TProductBuyQues } from './ProductBuyQues.interface';
import ProductBuyQues from './ProductBuyQues.model';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import deleteFile from '../../../shared/deleteFile';

export const ProductBuyQuesService = {
  createQuestion: async (questionData: TProductBuyQues) =>
    await ProductBuyQues.create(questionData),

  async updateQuestion(id: string, updateData: Partial<TProductBuyQues>) {
    const updatedQuestion = await ProductBuyQues.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updatedQuestion)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Product buy question not found!',
      );

    return updatedQuestion;
  },

  async deleteQuestion(id: string) {
    const deletedQuestion = await ProductBuyQues.findByIdAndDelete(id);

    if (!deletedQuestion)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Product buy question not found!',
      );

    // delete question image
    await deleteFile(deletedQuestion.image);

    return deletedQuestion;
  },

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  async addInnerQuestion(productId: string, questionData: TBuyQues) {
    // const newQuestion = { ...questionData };

    // Create the update object to push the new question into the 'questions' array
    const updatedProduct = await ProductBuyQues.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        'questions.name': { $ne: questionData.name },
      },
      {
        $push: { questions: questionData },
      },
      { new: true },
    );

    if (!updatedProduct) {
      throw new ApiError(StatusCodes.CONFLICT, 'Something went wrong!');
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

    if (Object.keys(updateData).length === 0)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No valid fields to update');

    const updatedProduct = await ProductBuyQues.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        'questions._id': new Types.ObjectId(questionId),
      },
      { $set: updateData },
      { new: true },
    );

    if (!updatedProduct)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Product or question not found!',
      );

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

    if (!updatedProduct)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Product or question not found!',
      );

    return updatedProduct;
  },

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
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

    if (!updatedProduct)
      throw new ApiError(StatusCodes.CONFLICT, 'Something went wrong!');

    return updatedProduct;
  },

  async updateOption(
    productId: string,
    questionId: string,
    optionId: string,
    option: string,
    price: number,
  ) {
    const updatedProduct = await ProductBuyQues.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        'questions._id': new Types.ObjectId(questionId),
        'questions.options._id': new Types.ObjectId(optionId),
      },
      {
        $set: {
          'questions.$.options.$[opt].option': option,
          'questions.$.options.$[opt].price': price,
        },
      },
      {
        arrayFilters: [{ 'opt._id': new Types.ObjectId(optionId) }],
        new: true,
      },
    );

    if (!updatedProduct)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Product, question, or option not found!',
      );

    return updatedProduct;
  },

  async deleteOption(productId: string, questionId: string, optionId: string) {
    const updatedProduct = await ProductBuyQues.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        'questions._id': new Types.ObjectId(questionId),
      },
      {
        $pull: { 'questions.$.options': { _id: new Types.ObjectId(optionId) } },
      },
      { new: true },
    );

    if (!updatedProduct)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Product, question, or option not found!',
      );
  },

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  async retrieveQuestion({ page = '1', limit = '10' }) {
    const products = await ProductBuyQues.find()
      .select('name image base_price')
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await ProductBuyQues.countDocuments();

    return {
      products,
      meta: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  },

  retrieveSingleQuestion: async (id: string) =>
    await ProductBuyQues.findById(id),

  async calcPrice(
    questionId: string,
    selectedQuestions: { quesId: string; optionId: string }[],
  ) {
    const product = await ProductBuyQues.findById(questionId).lean();

    if (!product)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');

    const selectedQuesMap = new Map(
      selectedQuestions.map(q => [q.quesId, q.optionId]),
    );

    const productQues = product.questions.map((q: any) => ({
      quesId: q._id.toString(),
      optionIds: q.options.map((opt: any) => opt._id.toString()),
    }));

    // Ensure all product questions are answered with a valid option
    const allSelected = productQues.every(
      ({ quesId, optionIds }) =>
        selectedQuesMap.has(quesId) &&
        optionIds.includes(selectedQuesMap.get(quesId)!),
    );

    if (!allSelected) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'All questions must be answered',
      );
    }

    const pipeline = [
      { $match: { _id: new Types.ObjectId(questionId) } },
      { $unwind: '$questions' },
      { $unwind: '$questions.options' },
      {
        $match: {
          $or: selectedQuestions.map(({ quesId, optionId }) => ({
            'questions._id': new Types.ObjectId(quesId),
            'questions.options._id': new Types.ObjectId(optionId),
          })),
        },
      },
      {
        $group: {
          _id: '$_id',
          base_price: { $first: '$base_price' },
          optionPrices: { $push: '$questions.options.price' },
        },
      },
      {
        $project: {
          _id: 0,
          total_price: {
            $multiply: [
              '$base_price',
              {
                $reduce: {
                  input: '$optionPrices',
                  initialValue: 1,
                  in: { $multiply: ['$$value', '$$this'] },
                },
              },
            ],
          },
        },
      },
    ];

    const result = await ProductBuyQues.aggregate(pipeline);
    if (!result.length)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to calculate price');

    return (Math.floor(result[0].total_price * 100) / 100).toFixed(2);
  },

  getInformation: async (
    questionId: string,
    selectedQuestions: { quesId: string; optionId: string }[],
  ) =>
    await ProductBuyQues.aggregate([
      { $match: { _id: new Types.ObjectId(questionId) } },
      { $unwind: '$questions' },
      { $unwind: '$questions.options' },
      {
        $match: {
          $or: selectedQuestions.map(({ quesId, optionId }) => ({
            'questions._id': new Types.ObjectId(quesId),
            'questions.options._id': new Types.ObjectId(optionId),
          })),
        },
      },
      {
        $project: {
          _id: 0,
          ques: '$questions.name',
          value: '$questions.options.option',
        },
      },
    ]),
};
