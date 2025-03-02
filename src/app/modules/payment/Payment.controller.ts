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

      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('✅ Payment Intent Succeeded:', event.data.object);
          break;
        case 'payment_intent.payment_failed':
          console.log('❌ Payment Failed:', event.data.object);
          break;
        default:
          console.log(`I Received unknown event type: ${event.type}`);
      }

      res.json({ received: true });
    }),
  },
};
