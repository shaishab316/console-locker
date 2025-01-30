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

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R A C K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

/** for customer */
// retrieved all products
publicRouter.get('/', ProductController.retrieveProducts);

// retrieved a product
publicRouter.get(
  '/:productType/:brand/:productName',
  ProductController.retrieveSingleProduct,
);

// calculate a product price
publicRouter.get(
  '/:productType/:brand/:productName/price',
  ProductController.calculateProductPrice,
);

export const ProductRoutes = {
  adminProductRoutes: privateRouter,
  customerProductRoutes: publicRouter,
};
