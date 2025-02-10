import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SettingService } from './Setting.service';

export const SettingController = {
  modify: catchAsync(async (req, res) => {
    await SettingService.modify(req.body.name, req.body.value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Setting modified successful.',
    });
  }),

  retrieve: catchAsync(async (req, res) => {
    const settings = await SettingService.retrieve();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Setting retrieved successful.',
      data: settings,
    });
  }),
};
