import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NotificationService } from './Notification.service';

export const NotificationController = {
  create: catchAsync(async (req, res) => {
    await NotificationService.create(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Thanks for contact us.',
    });
  }),

  list: catchAsync(async (req, res) => {
    const data = await NotificationService.list(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notifications retrieved successfully.',
      data,
    });
  }),

  retrieve: catchAsync(async (req, res) => {
    const notification = await NotificationService.retrieve(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notification retrieved successfully.',
      data: notification,
    });
  }),

  unReadCount: catchAsync(async (req, res) => {
    const notifications = await NotificationService.unReadCount();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Unread notification retrieved successfully.',
      data: {
        notifications,
      },
    });
  }),
};
