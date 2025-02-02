import { Router } from 'express';
import { OrderController } from './Order.controller';

const router = Router();

// create a order
router.post('/', OrderController.checkout);
router.post('/:id/cancel', OrderController.cancel);

export const OrderRoutes = router;
