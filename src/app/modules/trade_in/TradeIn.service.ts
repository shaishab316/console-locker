import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import Product from '../product/Product.model';
import { TTradeIn } from './TradeIn.interface';
import TradeIn from './TradeIn.model';
import { ProductBuyQuesService } from '../product_buy_question/ProductBuyQues.service';

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
};
