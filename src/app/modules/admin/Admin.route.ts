import { Router } from 'express';
import { AdminController } from './Admin.controller';
import rateLimit from 'express-rate-limit';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const router = Router();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  limit: 5, // Allow 5 requests per 10 minutes
  handler: () => {
    throw new ApiError(
      StatusCodes.TOO_MANY_REQUESTS,
      'Too many requests. Try again after 10 minutes.',
    );
  },
});

router.post('/login', limiter, AdminController.loginAdmin);
router.post('/send-otp', limiter, AdminController.sendOtp);
router.post('/verify-otp', limiter, AdminController.verifyOtp);
router.post('/reset-password', AdminController.resetPassword);

export const AdminRoutes = router;
