import { z } from 'zod';

export const ProductValidation = {
  productCreateValidationSchema: z.object({
    body: z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      offer_price: z.number().optional(),
      brand: z.string().min(1),
      model: z.string().min(1),
      condition: z.enum(['fair', 'good', 'excellent']),
      controller: z.number().nonnegative(),
      memory: z.string().min(1),
      quantity: z.number().int().nonnegative(),
      variants: z
        .array(
          z.object({
            images: z.array(z.string()).nonempty(),
            name: z.string().min(1),
            price: z.number().positive(),
            offer_price: z.number().optional(),
            brand: z.string().min(1),
            condition: z.enum(['fair', 'good', 'excellent']),
            quantity: z.number().int().nonnegative(),
          }),
        )
        .optional(),
    }),
  }),

  productUpdateValidationSchema: z.object({
    body: z.object({
      images: z.array(z.string()).optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.number().positive().optional(),
      offer_price: z.number().optional(),
      brand: z.string().optional(),
      model: z.string().optional(),
      condition: z.enum(['fair', 'good', 'excellent']).optional(),
      controller: z.number().nonnegative().optional(),
      memory: z.string().optional(),
      quantity: z.number().int().nonnegative().optional(),
    }),
  }),
};
