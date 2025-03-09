import { Router } from 'express';
import { CustomerController } from './Customer.controller';

const router = Router();

router.post('/resolve', CustomerController.resolve);

export const CustomerRoutes = router;
