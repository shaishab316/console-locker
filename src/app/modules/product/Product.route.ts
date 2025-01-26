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

privateRouter.patch(
  '/:id/edit',
  validateRequest(ProductValidation.productUpdateValidationSchema),
  ProductController.updateProduct,
);

privateRouter.patch(
  '/:productId/:variantId/edit',
  validateRequest(
    /** because Variant extend Product */
    ProductValidation.productUpdateValidationSchema,
  ),
  ProductController.updateVariant,
);

export const ProductRoutes = {
  adminProductRoutes: privateRouter,
  customerProductRoutes: publicRouter,
};
