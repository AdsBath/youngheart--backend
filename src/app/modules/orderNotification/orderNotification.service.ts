import { OrderNotification } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAllNotifications = async (): Promise<OrderNotification[] | []> => {
  const result = await prisma.orderNotification.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      order: true,
      user: true,
    },
  });
  return result;
};

const getUserNotification = async (
  userId: string,
): Promise<OrderNotification[] | []> => {
  const result = await prisma.orderNotification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const markAsRead = async () => {
  const result = await prisma.orderNotification.findMany({
    where: {
      read: false,
    },
  });

  if (!result || result.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No unread notifications found');
  }

  const notificationIds = result.map(notification => notification.id);

  const notifications = await prisma.orderNotification.updateMany({
    where: {
      id: { in: notificationIds },
    },
    data: { read: true },
  });

  return notifications;
};

export const OrderNotificationService = {
  getUserNotification,
  getAllNotifications,
  markAsRead,
};
