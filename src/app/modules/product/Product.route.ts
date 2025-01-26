import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './Product.validation';
import { ProductController } from './Product.controller';

const privateRouter = Router();
const publicRouter = Router();

privateRouter.post(
  '/create',
  validateRequest(ProductValidation.productCreateValidationSchema),
  ProductController.createProduct,
);

export const ProductRoutes = {
  adminProductRoutes: privateRouter,
  customerProductRoutes: publicRouter,
};
