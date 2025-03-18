import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ConfigAttrServices } from './ConfigAttr.service';

export const ConfigAttrControllers = {
  set: catchAsync(async (req, res) => {
    const data = await ConfigAttrServices.set(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'ConfigAttr updated successfully',
      data,
    });
  }),

  get: catchAsync(async (req, res) => {
    const data = await ConfigAttrServices.get();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'ConfigAttr retrieved successfully',
      data,
    });
  }),
};
