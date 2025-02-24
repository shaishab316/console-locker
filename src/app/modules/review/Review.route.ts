import { Router } from 'express';
import { ReviewController } from './Review.controller';

const adminRoutes = Router();

//>>>>>>>>>>>>>>>>>>>>>>>>>>

const customerRoutes = Router();

customerRoutes.post('/store', ReviewController.store);
customerRoutes.delete('/delete', ReviewController.delete);

export const ReviewRoutes = {
  customerRoutes,
  adminRoutes,
};
