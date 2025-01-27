import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './Product.validation';
import { ProductController } from './Product.controller';
import imageUploader from '../../middlewares/imageUploader';

const privateRouter = Router();
const publicRouter = Router();

/** for  Product */
privateRouter.post(
  '/create',
  imageUploader(),
  validateRequest(ProductValidation.productCreateValidationSchema),
  ProductController.createProduct,
);

privateRouter.patch(
  '/:productId/edit',
  imageUploader(),
  validateRequest(ProductValidation.productUpdateValidationSchema),
  ProductController.updateProduct,
);

privateRouter.delete('/:id/delete', ProductController.deleteProduct);

/** for  Product Variant */
privateRouter.post(
  '/:productId/variant/create',
  imageUploader(),
  validateRequest(ProductValidation.productVariantCreateValidationSchema),
  ProductController.createVariant,
);

privateRouter.patch(
  '/:productId/variant/:variantId/edit',
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
