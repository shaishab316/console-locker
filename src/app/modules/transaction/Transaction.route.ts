import { Router } from 'express';
import { TransactionController } from './Transaction.controller';

const router = Router();

router.get('/', TransactionController.retrieveTransaction);

export const TransactionRoutes = router;
