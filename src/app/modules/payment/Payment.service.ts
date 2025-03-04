import { TTransaction } from '../transaction/Transaction.interface';
import { Order } from '../order/Order.model';
import { TransactionService } from '../transaction/Transaction.service';
import stripe from './Payment.utils';
import Stripe from 'stripe';

export const PaymentService = {
  create: async (data: Record<string, any>) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['klarna', 'paypal'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
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
