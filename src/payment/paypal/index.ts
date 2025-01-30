import {
  Client,
  Environment,
  OrdersController,
  PaymentsController,
} from '@paypal/paypal-server-sdk';
import config from '../../config';

// Set up the PayPal environment
const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: config.payment.paypal.client as string,
    oAuthClientSecret: config.payment.paypal.secret as string,
  },
  timeout: 0,
  environment: Environment.Sandbox,
});

export const paypalOrdersController = new OrdersController(paypalClient);
export const paypalPaymentController = new PaymentsController(paypalClient);

export default paypalClient;
