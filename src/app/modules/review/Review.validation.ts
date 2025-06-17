import { z } from 'zod';
import Product from '../product/Product.model';

export const ReviewValidation = {
  create: z.object({
    body: z.object({
      customerName: z.string().trim().min(1, 'Customer name is required'),
      product: z
        .string()
        .refine(
          async name => name === 'home' || !!(await Product.exists({ name })),
          {
            message: 'Product not found',
          },
        ),
      rating: z
        .string()
        .regex(/^[1-5]$/, 'Rating must be a number between 1 and 5'),
      comment: z.string().min(1, 'Comment is required'),
    }),
  }),

  update: z.object({
    body: z.object({
      rating: z
        .number()
        .min(1, 'Rating is required')
        .max(5, 'Rating must be between 1 and 5')
        .optional(),
      comment: z.string().min(1, 'Comment is required').optional(),
    }),
  }),
};
