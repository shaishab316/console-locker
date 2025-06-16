import { NewsLetterServices } from './NewsLetter.service';
import catchAsync from '../../../shared/catchAsync';
import { NewsLetterTemplate } from './NewsLetter.template';

export const NewsLetterControllers = {
  unsubscribe: catchAsync(async (req, res) => {
    const customer = await NewsLetterServices.unsubscribe(
      (req.query as any).email,
    );

    res.send(NewsLetterTemplate.unsubscribe(customer));
  }),
};
