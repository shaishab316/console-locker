import { Router } from 'express';
import { ConfigAttrControllers } from './ConfigAttr.controller';

const router = Router();

router.get('/', ConfigAttrControllers.get);

export const ConfigAttrRoutes = router;
