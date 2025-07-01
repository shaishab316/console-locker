import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TradeInService } from './TradeIn.service';
import TradeIn from './TradeIn.model';
import { TradeInTemplate } from './TradeIn.template';
import { emailHelper } from '../../../helpers/emailHelper';

export const TradeInController = {
  createTrade: catchAsync(async (req, res) => {
    const newTrade = await TradeInService.createTrade(req.body);

    const trade: any = await TradeIn.findById(newTrade._id)
      .populate('product', 'name')
      .populate('customer', 'email name')
      .select('product customer');

    const html = TradeInTemplate.welcome({
      cName: trade?.customer?.name,
      pName: trade?.product?.name,
    });

    if (trade?.customer?.email) {
      //! don't do await for fast response
      emailHelper.sendEmail({
        to: trade.customer.email,
        subject: `We found your ${trade?.product?.name} sell Request!`,
        html,
      });
    }

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

  sendMail: catchAsync(async (req, res) => {
    const trade: any = await TradeIn.findById(req.body.id)
      .populate('product', 'name')
      .populate('customer', 'email name')
      .select('product customer');

    const html = TradeInTemplate.thanks({
      cName: trade?.customer?.name,
      note: req.body.note,
      pName: trade?.product?.name,
    });

    if (trade?.customer?.email) {
      await emailHelper.sendEmail({
        to: trade.customer.email,
        subject: `Thank You for ${trade?.product?.name} sell Request!`,
        html,
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Email sent successfully.',
    });
  }),

  confirmTrade: catchAsync(async (req, res) => {
    const newProduct = await TradeInService.confirmTrade(req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Product buy successful.',
      data: newProduct,
    });
  }),

  cancelTrade: catchAsync(async (req, res) => {
    await TradeInService.cancelTrade(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Trade cancel successful.',
    });
  }),
};
