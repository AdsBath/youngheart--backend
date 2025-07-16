import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderNotificationService } from './orderNotification.service';

const getAllNotifications: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderNotificationService.getAllNotifications();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All notifications fetched successfully',
      data: result,
    });
  },
);

const getUserNotification: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await OrderNotificationService.getUserNotification(userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get user notifications fetched successfully',
      data: result,
    });
  },
);

const markAsRead: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderNotificationService.markAsRead();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'mark as read successfully',
      data: result,
    });
  },
);

export const OrderNotificationController = {
  markAsRead,
  getAllNotifications,
  getUserNotification,
};
