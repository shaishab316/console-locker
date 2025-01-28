import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { TradeService } from './Trade.service';
import sendResponse from '../../../shared/sendResponse';

export const TradeController = {
  createTrade: catchAsync(async (req, res) => {
    const newTrade = await TradeService.createTrade(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Trade create successful.',
      data: newTrade,
    });
  }),

  deleteTrade: catchAsync(async (req, res) => {
    await TradeService.deleteTrade(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Trade deleted successful.',
    });
  }),
};
