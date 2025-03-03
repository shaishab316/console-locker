import { CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';
import {
  paypalOrdersController,
  paypalPaymentController,
} from '../../../payment/paypal';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import { TTransaction } from '../transaction/Transaction.interface';
import { Order } from '../order/Order.model';
import { TransactionService } from '../transaction/Transaction.service';
import Product from '../product/Product.model';
import axios from 'axios';
import QueryString from 'qs';
import stripe from './Payment.utils';
import Stripe from 'stripe';

export const PaymentService = {
  paypal: {
    async createIntent(totalPrice: number, orderId: string) {
      const collect = {
        body: {
          intent: CheckoutPaymentIntent.Capture,
          purchaseUnits: [
            { amount: { currencyCode: 'USD', value: totalPrice.toString() } },
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

      return { redirectUrl, orderId: result.id };
    },

    async success(query: Record<any, any>) {
      const { orderId, transaction_id } = query;

      const order = await Order.findById(orderId).populate(
        'productDetails.product',
      );

      if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found.');

      const transactionData: TTransaction = {
        transaction_id,
        type: 'sell',
        payment_method: 'paypal',
        amount: order.amount,
        customer: order.customer,
      };

      const transaction =
        await TransactionService.createTransaction(transactionData);

      order.transaction = transaction._id;
      order.state = 'success'; // Update order state to success

      // **Decrease product quantity**
      if (Array.isArray(order.productDetails)) {
        await Promise.all(
          order.productDetails.map(async item => {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { quantity: -item.quantity },
            });
          }),
        );
      } else {
        console.error(
          'order.productDetails is not an array:',
          order.productDetails,
        );
      }

      await order.save();
    },

    async refund(captureId: string, amount: string) {
      await paypalPaymentController.capturesRefund({
        captureId,
        body: { amount: { value: amount, currencyCode: 'USD' } },
      });
    },

    async captureOrder(orderId: string) {
      // Step 3: Capture the payment after user approval (backend step)
      const captureResponse = await paypalOrdersController.ordersCapture({
        id: orderId,
      });

      // Extract capture_id from the response
      const captureId =
        captureResponse.result.purchaseUnits?.[0]?.payments?.captures?.[0]?.id;

      console.log('Payment Captured. Capture ID:', captureId); // Capture ID for refunding

      return captureId; // Capture ID is used for refunds
    },

    async getToken() {
      const { data } = await axios.post(
        `${config.url.paypal_base_url}/v1/oauth2/token`,
        QueryString.stringify({ grant_type: 'client_credentials' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${config.payment.paypal.client}:${config.payment.paypal.secret}`).toString('base64')}`,
          },
        },
      );

      return data.access_token;
    },

    async payout(email: string, amount: string) {
      const payoutData = {
        sender_batch_header: {
          email_subject: 'You have received a payment!',
          sender_batch_id: `batch-${Date.now()}`,
        },
        items: [
          {
            recipient_type: 'EMAIL',
            receiver: email,
            amount: { value: amount, currency: 'USD' },
          },
        ],
      };

      const token = await this.getToken();

      const { data } = await axios.post(
        `${config.url.paypal_base_url}/v1/payments/payouts`,
        payoutData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    },

    async getPayoutDetails(payoutBatchId: string) {
      const token = await this.getToken();

      const response = await axios.get(
        `${config.url.paypal_base_url}/v1/payments/payouts/${payoutBatchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    },
  },

  stripe: {
    create: async (data: Record<string, any>) => {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['klarna'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: data.name },
              unit_amount: Math.round(data.amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: 'https://yourwebsite.com/success',
        cancel_url: 'https://yourwebsite.com/cancel',
      });

      return session.url;
    },
    success: async (event: Stripe.Event) => {
      const session: any = event.data.object;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );

      const order = await Order.findById(lineItems.data[0].description);

      if (!order) return;

      const transactionData: TTransaction = {
        transaction_id: session.payment_intent,
        type: 'sell',
        payment_method: 'klarna',
        amount: order.amount,
        customer: order.customer,
      };

      const transaction =
        await TransactionService.createTransaction(transactionData);

      order.transaction = transaction._id;
      order.payment_method = 'klarna';
      order.state = 'success';

      await order.save();
    },
  },
};
