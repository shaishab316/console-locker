import { CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';
import { paypalOrdersController } from '../../../payment/paypal';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';

export const PaymentService = {
  paypal: {
    async createIntent(totalPrice: number, orderId: string) {
      const collect = {
        body: {
          intent: CheckoutPaymentIntent.Capture,
          purchaseUnits: [
            {
              amount: {
                currencyCode: 'USD',
                value: totalPrice.toString(),
              },
            },
          ],
          application_context: {
            return_url: `${config.url.local}/payment/paypal/success?orderId=${orderId}`,
            cancel_url: `${config.url.local}/payment/paypal/cancel?orderId=${orderId}`,
          },
        },
        prefer: 'return=minimal',
      };

      const { result } = await paypalOrdersController.ordersCreate(collect);

      let redirectUrl = null;

      result!.links!.forEach(link => {
        if (link.rel === 'approve') redirectUrl = link.href;
      });

      if (!redirectUrl)
        throw new ApiError(
          StatusCodes.CONFLICT,
          'Payment URL not found. Sorry...',
        );

      return redirectUrl;
    },
  },
};
