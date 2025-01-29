import { Router } from 'express';
import { OrderController } from './Order.controller';

const router = Router();

// create a order
router.post('/', OrderController.checkout);

export const OrderRoutes = router;
