import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CustomerService } from './Customer.service';

export const CustomerController = {
  createCustomer: catchAsync(async (req, res) => {
    const newCustomer = await CustomerService.createCustomer(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Customer has created successfully!',
      data: newCustomer,
    });
  }),
};
