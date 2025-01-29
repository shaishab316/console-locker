import express, { Router } from 'express';
import { AdminRoutes } from '../app/modules/admin/Admin.route';
import { ProductRoutes } from '../app/modules/product/Product.route';
import { TradeRoutes } from '../app/modules/trade/Trade.route';
import { CustomerRoutes } from '../app/modules/customer/Customer.route';
import { OrderRoutes } from '../app/modules/order/Order.route';
import { PaymentRoutes } from '../app/modules/payment/Payment.route';

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
    path: '/trade',
    route: TradeRoutes,
  },
  {
    path: '/customer',
    route: CustomerRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },{
    path: "/checkout",
    route: OrderRoutes
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
