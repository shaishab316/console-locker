import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TransactionService } from './Transaction.service';

export const TransactionController = {
  retrieveTransaction: catchAsync(async (req, res) => {
    const data = await TransactionService.retrieveTransaction(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Transaction retrieved successful.',
      data,
    });
  }),
};
