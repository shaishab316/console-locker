import { z } from 'zod';

export const ProductValidation = {
  productCreateValidationSchema: z.object({
    body: z.object({
      images: z.array(z.string()).nonempty(),
      name: z.string().nonempty(),
      description: z.string().nonempty(),
      price: z.number().positive(),
      offer_price: z.number().optional(),
      brand: z.string().nonempty(),
      model: z.string().nonempty(),
      condition: z.enum(['fair', 'good', 'excellent']),
      controller: z.number().nonnegative(),
      memory: z.string().nonempty(),
      quantity: z.number().int().nonnegative(),
      variants: z
        .array(
          z.object({
            images: z.array(z.string()).nonempty(),
            name: z.string().nonempty(),
            price: z.number().positive(),
            offer_price: z.number().optional(),
            brand: z.string().nonempty(),
            condition: z.enum(['fair', 'good', 'excellent']),
            quantity: z.number().int().nonnegative(),
          }),
        )
        .optional(),
    }),
  }),
};
