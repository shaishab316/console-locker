import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Customer } from '../customer/Customer.model';
import NewsLetter from './NewsLetter.model';

export const NewsLetterServices = {
  async subscribe(email: string) {
    return NewsLetter.findOneAndUpdate(
      { email },
      { email },
      { upsert: true, new: true, runValidators: true },
    );
  },

  async unsubscribe(email: string) {
    const customer = await Customer.findOne({ email });

    if (!customer)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found');

    await NewsLetter.deleteOne({ email });

    return customer;
  },
};
