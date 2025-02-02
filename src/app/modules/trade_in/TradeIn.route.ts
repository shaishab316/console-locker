import { Router } from 'express';
import { TradeInController } from './TradeIn.controller';

const publicRouter = Router();
const privateRouter = Router();

publicRouter.post('/', TradeInController.createTrade);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

privateRouter.get('/', TradeInController.retrieveTrade);
privateRouter.post('/:id', TradeInController.confirmTrade);
privateRouter.post('/:id/cancel', TradeInController.cancelTrade);

export const TradeInRoutes = {
  customerRoutes: publicRouter,
  adminRoutes: privateRouter,
};
