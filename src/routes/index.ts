import express, { Router } from 'express';
// import { AuthRoutes } from '../app/modules/auth/auth.route';

// import { UserRoutes } from '../app/modules/user/user.route';
import { AdminRoutes } from '../app/modules/admin/Admin.route';

const router = express.Router();

const apiRoutes: { path: string; route: Router }[] = [
  // { path: '/user', route: UserRoutes },
  // { path: '/auth', route: AuthRoutes },

  {
    path: '/admin',
    route: AdminRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
