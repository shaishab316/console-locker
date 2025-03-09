import { TCustomer } from './Customer.interface';
import { Customer } from './Customer.model';

export const CustomerService = {
  async resolve(customerData: TCustomer) {
    const customer = await Customer.findOneAndUpdate(
      { email: customerData.email },
      { $set: customerData },
      { new: true, upsert: true },
    );

    return customer;
  },
};
