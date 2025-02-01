import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductBuyQuesValidation } from './ProductBuyQues.validation';
import { ProductBuyQuesController } from './ProductBuyQues.controller';
import imageUploader from '../../middlewares/imageUploader';

const privateRouter = Router();
const publicRouter = Router();

privateRouter.post(
  '/create',
  imageUploader(),
  (req, _, next) => {
    req.body.questions = JSON.parse(req.body.questions);
    next();
  },
  validateRequest(ProductBuyQuesValidation.createQuestionValidationSchema),
  ProductBuyQuesController.createQuestion,
);

privateRouter.patch(
  '/:id/edit',
  imageUploader(),
  (req, _, next) => {
    if (req.body.questions) req.body.questions = JSON.parse(req.body.questions);

    next();
  },
  validateRequest(ProductBuyQuesValidation.updateQuestionValidationSchema),
  ProductBuyQuesController.updateQuestion,
);

privateRouter.delete('/:id/delete', ProductBuyQuesController.deleteQuestion);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R A C K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

privateRouter.post(
  '/:id/questions/create',
  validateRequest(ProductBuyQuesValidation.addInnerQuestionValidationSchema),
  ProductBuyQuesController.addInnerQuestion,
);

privateRouter.patch(
  '/:id/questions/:quesId/edit',
  validateRequest(ProductBuyQuesValidation.updateInnerQuestionValidationSchema),
  ProductBuyQuesController.updateInnerQuestion,
);

privateRouter.delete(
  '/:id/questions/:quesId/delete',
  ProductBuyQuesController.deleteInnerQuestion,
);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R A C K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

privateRouter.post(
  '/:id/questions/:quesId/options/create',
  validateRequest(ProductBuyQuesValidation.addOptionValidationSchema),
  ProductBuyQuesController.addOption,
);

privateRouter.patch(
  '/:id/questions/:quesId/options/:optionId/edit',
  validateRequest(ProductBuyQuesValidation.updateOptionValidationSchema),
  ProductBuyQuesController.updateOption,
);

privateRouter.delete(
  '/:id/questions/:quesId/options/:optionId/delete',
  ProductBuyQuesController.deleteOption,
);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R A C K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

publicRouter.get('/', ProductBuyQuesController.retrieveQuestion);
publicRouter.get('/:id', ProductBuyQuesController.retrieveSingleQuestion);

export const ProductBuyQuesRoutes = {
  adminRoutes: privateRouter,
  customerRoutes: publicRouter,
};
