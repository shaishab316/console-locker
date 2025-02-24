import { z } from 'zod';
import Product from '../product/Product.model';

export const ReviewValidation = {
  create: z.object({
    body: z.object({
      customerName: z.string().trim().min(1, 'Customer name is required'),
      product: z
        .string()
        .refine(async id => !!(await Product.exists({ _id: id })), {
          message: 'Product not found',
        }),
      rating: z
        .string()
        .regex(/^[1-5]$/, 'Rating must be a number between 1 and 5'),
      comment: z.string().min(1, 'Comment is required'),
    }),
  }),
};
