import { TCustomer } from './Customer.interface';
import { Customer } from './Customer.model';

export const CustomerService = {
  async createCustomer(customerData: TCustomer) {
    const newCustomer = await Customer.create(customerData);

    return newCustomer;
  },
};
