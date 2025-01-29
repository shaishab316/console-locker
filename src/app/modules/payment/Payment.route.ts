import { Router } from 'express';
import { PaymentController } from './Payment.controller';

const router = Router();

/** for paypal */
router.get('/paypal/config', PaymentController.paypal.config);
// router.post('/paypal/intent', PaymentController.paypal.createIntent);

export const PaymentRoutes = router;
