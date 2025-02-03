import { Router } from 'express';

const publicRouter = Router();
const privateRouter = Router();

export const BlogRoutes = {
  adminRoutes: privateRouter,
  customerRoutes: publicRouter,
};
