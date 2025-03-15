import { TTransaction } from '../transaction/Transaction.interface';
import { Order } from '../order/Order.model';
import { TransactionService } from '../transaction/Transaction.service';
import stripe from './Payment.utils';
import Stripe from 'stripe';
import config from '../../../config';

export const PaymentService = {
  create: async ({ name, amount, method = 'klarna' }: Record<string, any>) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [method],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: method === 'klarna' ? 'eur' : 'usd',
            product_data: { name },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${config.url.payment.success}?orderId=${name}`,
      cancel_url: `${config.url.payment.cancel}?orderId=${name}`,
    });

    return session.url;
  },

  success: async (event: Stripe.Event) => {
    const session: any = event.data.object;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    const paymentIntent: any = await stripe.paymentIntents.retrieve(
      session.payment_intent,
    );

    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntent.payment_method,
    );

    const order = await Order.findById(lineItems.data[0].description);

    if (!order) return;

    const transactionData: TTransaction = {
      transaction_id: session.payment_intent,
      type: 'sell',
      payment_method: paymentMethod.type,
      amount: order.amount,
      customer: order.customer,
    };

    const transaction =
      await TransactionService.createTransaction(transactionData);

    order.transaction = transaction._id;
    order.payment_method = paymentMethod.type;
    order.state = 'success';

    await order.save();
  },
};
