import { Router } from 'express';
import { CustomerController } from './Customer.controller';

const router = Router();

// create a customer
router.post('/create', CustomerController.createCustomer);

export const CustomerRoutes = router;
