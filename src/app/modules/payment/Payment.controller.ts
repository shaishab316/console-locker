import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import config from '../../../config';

export const PaymentController = {
  paypal: {
    config: catchAsync(async (req, res) => {
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Paypal config retrieved successfully!',
        data: {
          client_id: config.payment.paypal.client,
        },
      });
    }),
    // createIntent: catchAsync(async (req, res) => {
    //   const payment = await PaymentService.paypal.createIntent();

    //   payment!.links!.forEach(link => {
    //     if (link.rel === 'approve') res.redirect(link.href);
    //   });

    //   sendResponse(res, {
    //     success: true,
    //     statusCode: StatusCodes.OK,
    //     message: 'Order has created successfully!',
    //     data: payment,
    //   });
    // }),
  },
};
