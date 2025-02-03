import { Router } from 'express';
import { SettingController } from './Setting.controller';

const privateRouter = Router();
const publicRouter = Router();

privateRouter.patch('/set', SettingController.modify);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

publicRouter.get('/', SettingController.retrieve);

export const SettingRoutes = {
  adminRoutes: privateRouter,
  customerRoutes: publicRouter,
};
