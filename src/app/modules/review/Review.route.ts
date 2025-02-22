import { Router } from 'express';
import { ReviewController } from './Review.controller';

const router = Router();

router.get('/', ReviewController.list);
router.post('/store', ReviewController.store);
router.delete('/:reviewId/delete', ReviewController.delete);

export const ReviewRoutes = router;
