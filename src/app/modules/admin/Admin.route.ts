import { Router } from 'express';
import { AdminController } from './Admin.controller';
import { limiter } from './Admin.utils';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './Admin.validation';
import verifyAdmin from '../../middlewares/verifyAdmin';
import { ProductRoutes } from '../product/Product.route';
import imageUploader from '../../middlewares/imageUploader';
import { TransactionRoutes } from '../transaction/Transaction.route';
import { ProductBuyQuesRoutes } from '../product_buy_question/ProductBuyQues.route';

const router = Router();

router.post(
  '/register',
  verifyAdmin,
  imageUploader(),
  validateRequest(AdminValidation.registerAdminSchema),
  AdminController.registerAdmin,
);
router.patch(
  '/edit',
  verifyAdmin,
  imageUploader(),
  AdminController.updateAdmin,
);
router.post('/login', limiter, AdminController.loginAdmin);
router.post('/log-out', AdminController.logoutAdmin);
router.post('/send-otp', limiter, AdminController.sendOtp);
router.post('/verify-otp', limiter, AdminController.verifyOtp);
router.post('/change-password', verifyAdmin, AdminController.changePassword);
router.post('/reset-password', AdminController.resetPassword);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

router.use('/product', verifyAdmin, ProductRoutes.adminProductRoutes);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */
router.use('/transaction', verifyAdmin, TransactionRoutes);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

router.use('/question/buy', verifyAdmin, ProductBuyQuesRoutes.adminRoutes);

export const AdminRoutes = router;
