import { z } from 'zod';

export const NewsLetterValidations = {
  unsubscribe: z.object({
    query: z.object({
      email: z.string().email(),
    }),
  }),
};
