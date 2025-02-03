import express, { Router } from 'express';
import { AdminRoutes } from '../app/modules/admin/Admin.route';
import { ProductRoutes } from '../app/modules/product/Product.route';
import { CustomerRoutes } from '../app/modules/customer/Customer.route';
import { OrderRoutes } from '../app/modules/order/Order.route';
import { PaymentRoutes } from '../app/modules/payment/Payment.route';
import { ProductBuyQuesRoutes } from '../app/modules/product_buy_question/ProductBuyQues.route';
import { BlogRoutes } from '../app/modules/blog/Blog.route';

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
  {
    path: '/customer',
    route: CustomerRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes.customerRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/sell',
    /** admin buy === customer sell */
    route: ProductBuyQuesRoutes.customerRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes.customerRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
