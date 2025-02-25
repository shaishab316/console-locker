import { Router } from 'express';
import { ReviewController } from './Review.controller';
import imageUploader from '../../middlewares/imageUploader';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './Review.validation';

const adminRoutes = Router();

adminRoutes.post(
  '/create',
  imageUploader(),
  validateRequest(ReviewValidation.create),
  ReviewController.create,
);

adminRoutes.patch(
  '/:reviewId/edit',
  validateRequest(ReviewValidation.update),
  ReviewController.update,
);

adminRoutes.delete('/:reviewId/delete', ReviewController.deleteById);

//>>>>>>>>>>>>>>>>>>>>>>>>>>

const customerRoutes = Router();

customerRoutes.post('/store', ReviewController.store);
customerRoutes.delete('/delete', ReviewController.delete);

export const ReviewRoutes = {
  customerRoutes,
  adminRoutes,
};
