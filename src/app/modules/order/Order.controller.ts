import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './Order.service';
import config from '../../../config';

export const OrderController = {
  checkout: catchAsync(async (req, res) => {
    const { orderId, amount } = (await OrderService.checkout(req)) as Record<
      any,
      any
    >;

    req.body.orderId = orderId;
    req.body.amount = amount;

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order has been created successfully!',
      data: {
        amount,
        orderId,
        client_id: config.payment.paypal.client as string,
      },
    });
  }),
};
