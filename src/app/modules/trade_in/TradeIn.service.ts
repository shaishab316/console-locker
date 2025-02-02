import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import Product from '../product/Product.model';
import { TTradeIn } from './TradeIn.interface';
import TradeIn from './TradeIn.model';
import { ProductBuyQuesService } from '../product_buy_question/ProductBuyQues.service';
import { PaymentService } from '../payment/Payment.service';
import ProductBuyQues from '../product_buy_question/ProductBuyQues.model';
import { TTransaction } from '../transaction/Transaction.interface';
import { TransactionService } from '../transaction/Transaction.service';
import { ProductService } from '../product/Product.service';
import { TProduct } from '../product/Product.interface';

export const TradeInService = {
  async createTrade(
    tradeData: TTradeIn & {
      questions: { quesId: string; optionId: string }[];
    },
  ) {
    if (tradeData.ref_product) {
      const product = await Product.findById(tradeData.ref_product);

      if (!product)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found.');
    }

    tradeData.price = +(await ProductBuyQuesService.calcPrice(
      tradeData.product.toString(),
      tradeData.questions,
    ));

    tradeData.information = await ProductBuyQuesService.getInformation(
      tradeData.product.toString(),
      tradeData.questions,
    );

    return await TradeIn.create(tradeData);
  },

  deleteTrade: async (tradeId: string) =>
    await TradeIn.findByIdAndDelete(tradeId),

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  async retrieveTrade(query: Record<any, any>) {
    const { page = 1, limit = 10, state } = query;
    const pageNumber = Math.max(1, +page);
    const pageSize = Math.max(1, +limit);

    const products = await TradeIn.aggregate([
      {
        $match: state ? { state } : {},
      },
      {
        $lookup: {
          from: 'productbuyques',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'product.image': 1,
          'product.name': 1,
          'customer.name': 1,
          'customer.avatar': 1,
          'customer.phone': 1,
          'customer.email': 1,
          price: 1,
          state: 1,
          createdAt: 1,
          statePriority: {
            $switch: {
              branches: [
                { case: { $eq: ['$state', 'pending'] }, then: 1 },
                { case: { $eq: ['$state', 'confirm'] }, then: 2 },
                { case: { $eq: ['$state', 'cancel'] }, then: 3 },
              ],
              default: 99,
            },
          },
          information: 1,
          payment: 1,
        },
      },
      { $sort: { statePriority: 1, createdAt: -1 } },
      { $unset: 'statePriority' },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
    ]).exec();

    const total = await TradeIn.countDocuments(state ? { state } : {});

    return {
      products,
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async confirmTrade(tradeId: string) {
    const trade = await TradeIn.findById(tradeId);
    const tradeProduct = await ProductBuyQues.findById(trade?.product);

    if (trade?.state !== 'pending')
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Trading is not available now.',
      );

    if (trade?.payment.paypal) {
      const productData: Record<any, any> = {
        images: [tradeProduct?.image],
        name: tradeProduct?.name,
        price: (Math.ceil(trade.price * 1.1) - 0.01).toFixed(2),
        quantity: 1,
      };

      trade.information.forEach(info => {
        if (
          ['brand', 'model', 'controller', 'condition'].includes(
            info.ques.toLowerCase(),
          )
        ) {
          productData[info.ques.toLowerCase()] = info.value;
        }
      });

      trade.state = 'confirm';
      await trade.save();

      /** do payment last,, because ,, ,, */
      const payoutResponse = await PaymentService.paypal.payout(
        trade.payment.paypal,
        trade.price.toString(),
      );

      // Extract payout_batch_id
      const payoutBatchId = payoutResponse?.batch_header?.payout_batch_id;

      if (!payoutBatchId) {
        throw new Error('Failed to retrieve payout batch ID');
      }

      const transactionData: TTransaction = {
        customer: trade.customer,
        amount: trade.price,
        payment_method: 'paypal',
        type: 'buy',
        transaction_id: payoutBatchId,
      };

      await TransactionService.createTransaction(transactionData);

      return await ProductService.createProduct(productData as TProduct)
    }

    /** if you are a sr. dev , then you understand */
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Something went wrong.');
  },

  async cancelTrade(tradeId: string) {
    const trade = await TradeIn.findById(tradeId);

    if (!trade) throw new ApiError(StatusCodes.NOT_FOUND, 'Trade not found.');

    if (trade.state !== 'pending')
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Something went wrong.');

    trade.state = 'cancel';

    await trade.save();
  },
};
