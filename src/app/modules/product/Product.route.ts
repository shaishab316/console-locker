import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './Product.validation';
import { ProductController } from './Product.controller';
import imageUploader from '../../middlewares/imageUploader';
import { ReviewController } from '../review/Review.controller';

const privateRouter = Router();
const publicRouter = Router();

/** for  admin */
// create a new product
privateRouter.post(
  '/create',
  imageUploader(),
  validateRequest(ProductValidation.create),
  ProductController.create,
);
privateRouter.patch(
  '/label/edit/:name',
  validateRequest(ProductValidation.editLabel),
  ProductController.editLabel,
);

// update a product
privateRouter.patch(
  '/:slug/edit',
  imageUploader(),
  validateRequest(ProductValidation.update),
  ProductController.update,
);

// delete a product
privateRouter.delete('/:id/delete', ProductController.delete);
privateRouter.delete('/delete/:name', ProductController.deleteByName);

// create a new variant
privateRouter.post(
  '/:productId/variant/create',
  imageUploader(),
  validateRequest(ProductValidation.createVariant),
  ProductController.createVariant,
);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

/** for customer */
// retrieved all products
publicRouter.get('/', ProductController.list);
publicRouter.get('/name/:productName', ProductController.listByName);

publicRouter.get('/name/:productName/exists', ProductController.exists);

publicRouter.get('/retrieve', ProductController.retrieveByIds);

publicRouter.get('/:productName/find-slug', ProductController.findSlug);
publicRouter.get('/:productName/reviews', ReviewController.list);

publicRouter.get('/:slug', ProductController.retrieve);

export const ProductRoutes = {
  adminProductRoutes: privateRouter,
  customerProductRoutes: publicRouter,
};
