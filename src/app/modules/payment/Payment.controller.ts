import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import config from '../../../config';
import { PaymentService } from './Payment.service';

export const PaymentController = {
  paypal: {
    config: catchAsync(async (_req, res) => {
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Paypal config retrieved successfully!',
        data: {
          client_id: config.payment.paypal.client,
        },
      });
    }),
    success: catchAsync(async (req, res) => {
      await PaymentService.paypal.success(req.query);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Order payment successfully!',
      });
    }),
  },
};
