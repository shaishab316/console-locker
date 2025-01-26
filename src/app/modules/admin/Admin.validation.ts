import { z } from 'zod';
import { passwordRegex } from '../../../util/passwordRegex';

export const AdminValidation = {
  registerAdminSchema: z.object({
    body: z.object({
      name: z.string().min(3, 'Name should be at least 3 characters long'),
      email: z
        .string()
        .email('Invalid email address')
        .min(5, 'Email should be at least 5 characters long'),
      phone: z
        .string()
        .min(10, 'Phone number should be at least 10 digits long')
        .max(15, 'Phone number should not exceed 15 digits'),
      password: z
        .string()
        .regex(
          passwordRegex,
          'Password must be at least 8 characters long, with 1 uppercase letter, 1 number, and 1 special character',
        ),
      avatar: z.string().url('Avatar should be a valid URL'),
    }),
  }),
};
