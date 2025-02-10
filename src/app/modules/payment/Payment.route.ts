import { Router } from 'express';
import { PaymentController } from './Payment.controller';

const router = Router();

/** for paypal */
router.get('/paypal/config', PaymentController.paypal.config);
router.get('/paypal/success', PaymentController.paypal.success);

export const PaymentRoutes = router;
