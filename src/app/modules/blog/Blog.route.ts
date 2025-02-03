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

export const BlogRoutes = {
  adminRoutes: privateRouter,
  customerRoutes: publicRouter,
};
