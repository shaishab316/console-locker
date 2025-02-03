import { Router } from 'express';
import imageUploader from '../../middlewares/imageUploader';
import { BlogController } from './Blog.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidation } from './Blog.validation';

const publicRouter = Router();
const privateRouter = Router();

privateRouter.post(
  '/create',
  imageUploader(),
  validateRequest(BlogValidation.create),
  BlogController.create,
);

privateRouter.patch(
  '/:id/edit',
  imageUploader(),
  validateRequest(BlogValidation.update),
  BlogController.update,
);

privateRouter.delete('/:id/delete', BlogController.delete);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

publicRouter.get('/', BlogController.list);

export const BlogRoutes = {
  adminRoutes: privateRouter,
  customerRoutes: publicRouter,
};
