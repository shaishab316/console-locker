import { Router } from 'express';
import { PaymentController } from './Payment.controller';
import bodyParser from 'body-parser';

const router = Router();

router.post(
  '/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }),
  PaymentController.webhook,
);

export const PaymentRoutes = router;
