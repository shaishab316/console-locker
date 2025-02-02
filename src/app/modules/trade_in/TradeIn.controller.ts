import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TradeInService } from './TradeIn.service';

export const TradeInController = {
  createTrade: catchAsync(async (req, res) => {
    const newTrade = await TradeInService.createTrade(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Trade create successful.',
      data: newTrade,
    });
  }),

  deleteTrade: catchAsync(async (req, res) => {
    await TradeInService.deleteTrade(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Trade deleted successful.',
    });
  }),

  /**
   * *************************************************************************************************************
   *                                                                                                           *
   *                                           L I N E   B R E A K                                           *
   *                                                                                                           *
   * **************************************************************************************************************
   */

  retrieveTrade: catchAsync(async (req, res) => {
    const trades = await TradeInService.retrieveTrade(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Trades are retrieved successful.',
      data: trades,
    });
  }),

  confirmTrade: catchAsync(async (req, res) => {
    await TradeInService.confirmTrade(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product buy successful.',
    });
  }),
};
