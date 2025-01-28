import { Client, Environment } from "@paypal/paypal-server-sdk";
import config from "../../config";

// Set up the PayPal environment
const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: config.payment.paypal.client as string,
    oAuthClientSecret: config.payment.paypal.secret as string,
  },
  timeout: 0,
  environment: Environment.Sandbox,
});

export default client;
