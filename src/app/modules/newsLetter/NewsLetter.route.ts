import { Router } from 'express';
import { NewsLetterControllers } from './NewsLetter.controller';
import validateRequest from '../../middlewares/validateRequest';
import { NewsLetterValidations } from './NewsLetter.validation';

const router = Router();

router.get(
  '/',
  validateRequest(NewsLetterValidations.unsubscribe),
  NewsLetterControllers.unsubscribe,
);

export const NewsLetterRoutes = router;
