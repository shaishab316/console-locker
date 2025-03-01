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
import { TradeInRoutes } from '../trade_in/TradeIn.route';
import { OrderRoutes } from '../order/Order.route';
import { BlogRoutes } from '../blog/Blog.route';
import { SettingRoutes } from '../setting/Setting.route';
import { NotificationRoutes } from '../notification/Notification.route';
import { NotificationController } from '../notification/Notification.controller';
import { ReviewRoutes } from '../review/Review.route';

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
router.post('/reset-password', verifyAdmin, AdminController.resetPassword);

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
router.use('/buy', verifyAdmin, TradeInRoutes.adminRoutes);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

router.use('/order', verifyAdmin, OrderRoutes.adminRoutes);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

router.use('/blog', verifyAdmin, BlogRoutes.adminRoutes);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

router.use('/setting', verifyAdmin, SettingRoutes.adminRoutes);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

router.use('/reviews', verifyAdmin, ReviewRoutes.adminRoutes);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

router.use('/notification', verifyAdmin, NotificationRoutes.adminRoutes);
router.get(
  '/unread-notification',
  verifyAdmin,
  NotificationController.unReadCount,
);

export const AdminRoutes = router;
