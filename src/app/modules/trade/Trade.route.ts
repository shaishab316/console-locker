import { Router } from 'express';
import { TradeController } from './Trade.controller';

const router = Router();

// create a trade
router.post('/create', TradeController.createTrade);

// delete a trade
router.delete('/:id/delete', TradeController.deleteTrade);

export const TradeRoutes = router;
