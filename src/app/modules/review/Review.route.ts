import { Router } from 'express';
import { ReviewController } from './Review.controller';

const router = Router();

router.post('/store', ReviewController.store);
router.delete('/:reviewId/delete', ReviewController.delete);

export const ReviewRoutes = router;
