import { z } from 'zod';

export const TradeInValidations = {
  sendMail: z.object({
    body: z.object({
      id: z.string({ required_error: 'Id is required' }),
      note: z.string({ required_error: 'Note is required' }),
    }),
  }),
};
