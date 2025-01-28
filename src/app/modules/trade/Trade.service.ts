import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import Product from '../product/Product.model';
import { TTrade } from './Trade.interface';
import Trade from './Trade.model';

export const TradeService = {
  async createTrade(tradeData: TTrade) {
    const price = 200; /** TODO: calculate price */

    tradeData.price = price;
    const product = await Product.findById(tradeData.product);

    if (!product)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found.');

    const newTrade = await Trade.create(tradeData);

    return newTrade;
  },

  deleteTrade: async (tradeId: string) =>
    await Trade.deleteOne({ id: tradeId }),
};
