import { Router } from 'express';
import { PaymentController } from './Payment.controller';
import bodyParser from 'body-parser';

const router = Router();

/** for paypal */
router.get('/paypal/config', PaymentController.paypal.config);
router.get('/paypal/success', PaymentController.paypal.success);

/** for stripe */
router.post('/stripe/create', PaymentController.stripe.create);
router.post(
  '/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }),
  PaymentController.stripe.webhook,
);

export const PaymentRoutes = router;
