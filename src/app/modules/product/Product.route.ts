import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './Product.validation';
import { ProductController } from './Product.controller';
import imageUploader from '../../middlewares/imageUploader';

const privateRouter = Router();
const publicRouter = Router();

/** for  admin */
// create a new product
privateRouter.post(
  '/create',
  imageUploader(),
  validateRequest(ProductValidation.productCreateValidationSchema),
  ProductController.createProduct,
);

// update a product
privateRouter.patch(
  '/:productId/edit',
  imageUploader(),
  validateRequest(ProductValidation.productUpdateValidationSchema),
  ProductController.updateProduct,
);

// delete a product
privateRouter.delete('/:id/delete', ProductController.deleteProduct);

// create a new variant
privateRouter.post(
  '/:productId/variant/create',
  imageUploader(),
  validateRequest(ProductValidation.productVariantCreateValidationSchema),
  ProductController.createVariant,
);

// update a variant
privateRouter.patch(
  '/:productId/variant/:variantId/edit',
  imageUploader(),
  validateRequest(
    /** because Variant extend Product */
    ProductValidation.productUpdateValidationSchema,
  ),
  ProductController.updateVariant,
);

// delete a variant
privateRouter.delete(
  '/:productId/variant/:variantId/delete',
  ProductController.deleteVariant,
);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R A C K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

/** for customer */
// retrieved all products
publicRouter.get('/', ProductController.retrieveProduct);

export const ProductRoutes = {
  adminProductRoutes: privateRouter,
  customerProductRoutes: publicRouter,
};
