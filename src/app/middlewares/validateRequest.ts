import { AnyZodObject } from 'zod';
import catchAsync from '../../shared/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, _, next) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
      query: req.query,
    });

    next();
  });
};

export default validateRequest;
