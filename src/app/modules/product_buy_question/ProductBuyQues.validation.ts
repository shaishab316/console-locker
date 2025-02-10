import { z } from 'zod';

const optionSchema = z.object({
  option: z.string(),
  price: z.number().max(1, { message: 'Price should be less than 1' }),
});

const questionSchema = z.object({
  name: z.string(),
  description: z.string(),
  options: z.array(optionSchema),
});

const createQuestionValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    base_price: z.preprocess(
      val => (typeof val === 'string' ? parseFloat(val) : val),
      z.number(),
    ),
    questions: z.array(questionSchema),
  }),
});

const updateQuestionValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    base_price: z
      .preprocess(
        val => (typeof val === 'string' ? parseFloat(val) : val),
        z.number(),
      )
      .optional(),
    questions: z.array(questionSchema).optional(),
  }),
});

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

const addInnerQuestionValidationSchema = z.object({
  body: questionSchema,
});

const updateInnerQuestionValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    options: z.array(optionSchema).optional(),
  }),
});

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

const addOptionValidationSchema = z.object({
  body: optionSchema,
});

const updateOptionValidationSchema = z.object({
  body: z.object({
    option: z.string().optional(),
    price: z
      .number()
      .max(1, { message: 'Price should be less than 1' })
      .optional(),
  }),
});

export const ProductBuyQuesValidation = {
  createQuestionValidationSchema,
  updateQuestionValidationSchema,
  addInnerQuestionValidationSchema,
  updateInnerQuestionValidationSchema,
  addOptionValidationSchema,
  updateOptionValidationSchema,
};
