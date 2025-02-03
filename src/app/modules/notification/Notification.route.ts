import { Router } from 'express';
import { NotificationController } from './Notification.controller';
import validateRequest from '../../middlewares/validateRequest';
import { NotificationValidation } from './Notification.validation';

const privateRouter = Router();
const publicRouter = Router();

publicRouter.post(
  '/',
  validateRequest(NotificationValidation.create),
  NotificationController.create,
);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

privateRouter.get('/', NotificationController.list);
privateRouter.get('/:id', NotificationController.retrieve);

export const NotificationRoutes = {
  adminRoutes: privateRouter,
  customerRoutes: publicRouter,
};
