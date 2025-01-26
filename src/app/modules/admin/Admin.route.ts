import { Router } from 'express';
import { AdminController } from './Admin.controller';
import { limiter } from './Admin.utils';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './Admin.validation';
import verifyAdmin from '../../middlewares/verifyAdmin';

const router = Router();

router.post(
  '/register',
  verifyAdmin,
  validateRequest(AdminValidation.registerAdminSchema),
  AdminController.registerAdmin,
);
router.post('/login', limiter, AdminController.loginAdmin);
router.post('/send-otp', limiter, AdminController.sendOtp);
router.post('/verify-otp', limiter, AdminController.verifyOtp);
router.post('/reset-password', AdminController.resetPassword);

export const AdminRoutes = router;
