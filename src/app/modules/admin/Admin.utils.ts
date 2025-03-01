import rateLimit from 'express-rate-limit';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

export const generateOtp = () =>
  Math.floor(1_00_000 + Math.random() * 9_00_000);

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1-minute window
  limit: 100, // Allow 100 requests per minute
  handler: () => {
    throw new ApiError(
      StatusCodes.TOO_MANY_REQUESTS,
      'Too many requests. Try again after 10 minutes.',
    );
  },
});
