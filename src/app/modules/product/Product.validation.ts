import { z } from 'zod';

export const ProductValidation = {
  productCreateValidationSchema: z.object({
    body: z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      price: z
        .string()
        .min(1)
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val), {
          message: 'Price must be a valid number',
        }),
      offer_price: z
        .string()
        .optional()
        .transform(val => parseFloat(val as string))
        .refine(val => !isNaN(val), {
          message: 'Offer price must be a valid number',
        }),
      brand: z.string().min(1),
      model: z.string().min(1),
      condition: z.enum(['fair', 'good', 'excellent']),
      controller: z
        .string()
        .min(1)
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val), {
          message: 'Controller must be a valid number',
        }),
      memory: z.string().min(1),
      quantity: z
        .string()
        .min(1)
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val), {
          message: 'Quantity must be a valid number',
        }),
    }),
  }),

  productVariantCreateValidationSchema: z.object({
    body: z.object({
      name: z.string().min(1),
      price: z
        .string()
        .min(1)
        .transform(val => parseFloat(val))
        .refine(val => !isNaN(val), {
          message: 'Price must be a valid number',
        }),
      offer_price: z
        .string()
        .optional()
        .transform(val => parseFloat(val as string))
        .refine(val => !isNaN(val), {
          message: 'Offer price must be a valid number',
        }),
      brand: z.string().min(1),
      condition: z.enum(['fair', 'good', 'excellent']),
      quantity: z
        .string()
        .min(1)
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val), {
          message: 'Quantity must be a valid number',
        }),
    }),
  }),

  productUpdateValidationSchema: z.object({
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      price: z
        .string()
        .optional()
        .transform(val => parseFloat(val as string))
        .refine(val => !isNaN(val), {
          message: 'Price must be a valid number',
        }),
      offer_price: z
        .string()
        .optional()
        .transform(val => parseFloat(val as string))
        .refine(val => !isNaN(val), {
          message: 'Offer price must be a valid number',
        }),
      brand: z.string().optional(),
      model: z.string().optional(),
      condition: z.enum(['fair', 'good', 'excellent']).optional(),
      controller: z
        .string()
        .optional()
        .transform(val => parseInt(val as string, 10))
        .refine(val => !isNaN(val), {
          message: 'Controller must be a valid number',
        }),
      memory: z.string().optional(),
      quantity: z
        .string()
        .optional()
        .transform(val => parseInt(val as string, 10))
        .refine(val => !isNaN(val), {
          message: 'Quantity must be a valid number',
        }),
    }),
  }),
};
