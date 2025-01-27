import express, { Router } from 'express';
import { AdminRoutes } from '../app/modules/admin/Admin.route';
import { ProductRoutes } from '../app/modules/product/Product.route';

const router = express.Router();

const apiRoutes: { path: string; route: Router }[] = [
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes.customerProductRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
