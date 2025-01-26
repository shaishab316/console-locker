import rateLimit from "express-rate-limit";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

export const generateOtp = () =>
  Math.floor(1_00_000 + Math.random() * 9_00_000);

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  limit: 5, // Allow 5 requests per 10 minutes
  handler: () => {
    throw new ApiError(
      StatusCodes.TOO_MANY_REQUESTS,
      'Too many requests. Try again after 10 minutes.',
    );
  },
});
