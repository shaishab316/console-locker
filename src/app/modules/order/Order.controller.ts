import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './Order.service';

export const OrderController = {
  createOrder: catchAsync(async (req, res) => {
    const newOrder = await OrderService.createOrder(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order has created successfully!',
      data: newOrder,
    });
  }),
};
