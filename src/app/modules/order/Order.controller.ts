import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './Order.service';
import { PaymentService } from '../payment/Payment.service';

export const OrderController = {
  checkout: catchAsync(async (req, res) => {
    const { orderId, amount } = (await OrderService.checkout(req)) as Record<
      any,
      any
    >;

    const checkout_url = await PaymentService.create({
      name: orderId.toString(),
      amount,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order created successfully!',
      data: {
        checkout_url,
      },
    });
  }),

  cancel: catchAsync(async (req, res) => {
    await OrderService.cancel(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order has been cancel successfully!',
    });
  }),

  shipped: catchAsync(async (req, res) => {
    await OrderService.shipped(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order has been shipped successfully!',
    });
  }),

  list: catchAsync(async (req, res) => {
    const data = await OrderService.list(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Orders retrieved successfully!',
      data,
    });
  }),

  retrieve: catchAsync(async (req, res) => {
    const data = await OrderService.retrieve(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Order retrieved successfully!',
      data,
    });
  }),
};
