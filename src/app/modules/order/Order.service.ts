import { TOrder } from './Order.interface';
import { Order } from './Order.model';

export const OrderService = {
  async createOrder(orderData: TOrder) {
    const newOrder = await Order.create(orderData);

    return newOrder;
  },
};
