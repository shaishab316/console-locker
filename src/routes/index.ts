import { Router } from 'express';
import { AdminRoutes } from '../app/modules/admin/Admin.route';
import { ProductRoutes } from '../app/modules/product/Product.route';
import { CustomerRoutes } from '../app/modules/customer/Customer.route';
import { OrderRoutes } from '../app/modules/order/Order.route';
import { PaymentRoutes } from '../app/modules/payment/Payment.route';
import { ProductBuyQuesRoutes } from '../app/modules/product_buy_question/ProductBuyQues.route';
import { BlogRoutes } from '../app/modules/blog/Blog.route';
import { SettingRoutes } from '../app/modules/setting/Setting.route';
import { NotificationRoutes } from '../app/modules/notification/Notification.route';
import { ReviewRoutes } from '../app/modules/review/Review.route';
import { ConfigAttrRoutes } from '../app/modules/configattr/ConfigAttr.route';
import { NewsLetterRoutes } from '../app/modules/newsLetter/NewsLetter.route';

const router = Router();

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
  {
    path: '/setting',
    route: SettingRoutes.customerRoutes,
  },
  {
    path: '/contact',
    route: NotificationRoutes.customerRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes.customerRoutes,
  },
  {
    path: '/config-attr',
    route: ConfigAttrRoutes,
  },
  {
    path: '/unsubscribe',
    route: NewsLetterRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
