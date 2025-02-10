import { z } from 'zod';

export const NotificationValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      subject: z.string().min(1, 'Subject is required'),
      email: z
        .string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
      message: z.string().min(1, 'Message is required'),
    }),
  }),
};
