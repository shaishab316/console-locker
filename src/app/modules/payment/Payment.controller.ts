import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import config from '../../../config';
import { PaymentService } from './Payment.service';
import stripe from './Payment.utils';

export const PaymentController = {
  paypal: {
    config: catchAsync(async (_req, res) => {
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Paypal config retrieved successfully!',
        data: { client_id: config.payment.paypal.client },
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

  stripe: {
    create: catchAsync(async (req, res) => {
      const data = await PaymentService.stripe.create(req.body);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Order created successfully!',
        data,
      });
    }),

    webhook: catchAsync(async (req, res) => {
      const sig = req.headers['stripe-signature'];

      const event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        config.payment.stripe.webhook_secret,
      );

      if (event.type === 'checkout.session.completed')
        await PaymentService.stripe.success(event);

      res.json({ received: !!1 });
    }),
  },
};
