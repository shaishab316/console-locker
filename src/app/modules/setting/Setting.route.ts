import { Router } from 'express';
import { SettingController } from './Setting.controller';

const privateRouter = Router();
const publicRouter = Router();

privateRouter.patch('/set', SettingController.modify);

export const SettingRoutes = {
  adminRoutes: privateRouter,
  customerRoutes: publicRouter,
};
