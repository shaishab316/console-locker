import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductBuyQuesValidation } from './ProductBuyQues.validation';
import { ProductBuyQuesController } from './ProductBuyQues.controller';
import imageUploader from '../../middlewares/imageUploader';

const router = Router();

router.post(
  '/create',
  imageUploader(),
  (req, _, next) => {
    req.body.questions = JSON.parse(req.body.questions);
    next();
  },
  validateRequest(ProductBuyQuesValidation.createQuestionValidationSchema),
  ProductBuyQuesController.createQuestion,
);

router.patch(
  '/:id/edit',
  imageUploader(),
  (req, _, next) => {
    if (req.body.questions) req.body.questions = JSON.parse(req.body.questions);

    next();
  },
  validateRequest(ProductBuyQuesValidation.updateQuestionValidationSchema),
  ProductBuyQuesController.updateQuestion,
);

router.delete('/:id/delete', ProductBuyQuesController.deleteQuestion);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R A C K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

router.post(
  '/:id/questions/create',
  validateRequest(ProductBuyQuesValidation.addInnerQuestionValidationSchema),
  ProductBuyQuesController.addInnerQuestion,
);

router.patch(
  '/:id/questions/:quesId/edit',
  validateRequest(ProductBuyQuesValidation.updateInnerQuestionValidationSchema),
  ProductBuyQuesController.updateInnerQuestion,
);

router.delete(
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

router.post(
  '/:id/questions/:quesId/options/create',
  validateRequest(ProductBuyQuesValidation.addOptionValidationSchema),
  ProductBuyQuesController.addOption,
);

router.patch(
  '/:id/questions/:quesId/options/:optionId/edit',
  validateRequest(ProductBuyQuesValidation.updateOptionValidationSchema),
  ProductBuyQuesController.updateOption,
);

// router.post('/product/:productId/question/:questionId/option', addOption);

// router.put(
//   '/product/:productId/question/:questionId/option/:optionId',
//   updateOption,
// );

// router.delete(
//   '/product/:productId/question/:questionId/option/:optionId',
//   deleteOption,
// );

export const ProductBuyQuesRoutes = router;
