import { Router } from 'express';
import { TradeInController } from './TradeIn.controller';

const router = Router();

router.post('/', TradeInController.createTrade);

export const TradeInRoutes = router;
