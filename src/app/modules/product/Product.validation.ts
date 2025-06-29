import { z } from 'zod';

export const ProductValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(1),
      product_type: z.string().min(1),
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
      condition: z.string().min(1),
      controller: z.string().min(1),
      memory: z.string().min(1),
      quantity: z
        .string()
        .min(1)
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val), {
          message: 'Quantity must be a valid number',
        }),
      modelDes: z.string().optional(),
      conditionDes: z.string().optional(),
      controllerDes: z.string().optional(),
      memoryDes: z.string().optional(),

      modelLabel: z.string().optional(),
      conditionLabel: z.string().optional(),
      controllerLabel: z.string().optional(),
      memoryLabel: z.string().optional(),
    }),
  }),

  createVariant: z.object({
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
      condition: z.string().min(1),
      quantity: z
        .string()
        .min(1)
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val), {
          message: 'Quantity must be a valid number',
        }),
    }),
  }),

  update: z.object({
    body: z.object({
      name: z.string().optional(),
      product_type: z.string().optional(),
      description: z.string().optional(),
      price: z
        .union([z.string(), z.number()])
        .optional()
        .transform(val =>
          val === undefined ? undefined : parseFloat(val as string),
        )
        .refine(val => val === undefined || !isNaN(val), {
          message: 'Price must be a valid number',
        }),
      offer_price: z
        .union([z.string(), z.number()])
        .optional()
        .transform(val =>
          val === undefined ? undefined : parseFloat(val as string),
        )
        .refine(val => val === undefined || !isNaN(val), {
          message: 'Offer price must be a valid number',
        }),
      brand: z.string().optional(),
      model: z.string().optional(),
      condition: z.string().optional(),
      controller: z.string().optional(),
      memory: z.string().optional(),
      quantity: z
        .union([z.string(), z.number()])
        .optional()
        .transform(val =>
          val === undefined ? undefined : parseInt(val as string, 10),
        )
        .refine(val => val === undefined || !isNaN(val), {
          message: 'Quantity must be a valid number',
        }),
      modelDes: z.string().optional(),
      conditionDes: z.string().optional(),
      controllerDes: z.string().optional(),
      memoryDes: z.string().optional(),

      caption: z.string().optional(),
    }),
  }),

  editLabel: z.object({
    body: z.object({
      modelLabel: z.string().optional(),
      conditionLabel: z.string().optional(),
      controllerLabel: z.string().optional(),
      memoryLabel: z.string().optional(),
      name: z.string().optional(),
      brand: z.string().optional(),
      order: z.coerce.number().optional(),
    }),
  }),
};
