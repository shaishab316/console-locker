import { z } from 'zod';

export const BlogValidation = {
  create: z.object({
    body: z.object({
      title: z.string().min(1, { message: 'Title is required' }),
      description: z.string().min(1, { message: 'Description is required' }),
      slug: z.string().optional(),
    }),
  }),
  update: z.object({
    body: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      slug: z.string().optional(),
    }),
  }),
};
