import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import config from '../../../config';
import { PaymentService } from './Payment.service';
import stripe from './Payment.utils';

export const PaymentController = {
  create: catchAsync(async (req, res) => {
    const data = await PaymentService.create(req.body);

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
      await PaymentService.success(event);

    res.json({ received: !!1 });
  }),
};
