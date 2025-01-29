import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './Order.service';

export const OrderController = {
  checkout: catchAsync(async (req, res) => {
    const redirectUrl = await OrderService.checkout(req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order has been created successfully!',
      data: redirectUrl,
    });
  }),
};
