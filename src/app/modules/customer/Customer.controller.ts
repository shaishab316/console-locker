import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CustomerService } from './Customer.service';

export const CustomerController = {
  resolve: catchAsync(async (req, res) => {
    const customer = await CustomerService.resolve(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Customer resolved successfully!',
      data: customer,
    });
  }),
};
