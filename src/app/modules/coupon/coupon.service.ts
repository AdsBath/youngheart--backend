import { Coupon } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ICoupon } from './coupon.interface';

const insertIntoDB = async (data: any): Promise<Coupon | null> => {
  const result = await prisma.coupon.create({
    data,
  });
  return result;
};

const getAllFromDB = async (): Promise<ICoupon> => {
  const result = await prisma.coupon.findMany({
    orderBy: { id: 'desc' },
  });

  const total = await prisma.coupon.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Coupon | null> => {
  const result = await prisma.coupon.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<Coupon>,
  id: string,
): Promise<Coupon | null> => {
  const result = await prisma.coupon.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Coupon | null> => {
  const result = await prisma.coupon.delete({
    where: {
      id,
    },
  });
  return result;
};

const applyCoupon = async (
  totalPrice: number,
  couponCode: string,
  userId: string,
) => {
  // Fetch the coupon details
  const coupon = await prisma.coupon.findUnique({
    where: { code: couponCode },
  });

  if (!coupon) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid coupon code');
  }

  // Check coupon validity
  const currentDate = new Date();
  if (currentDate < coupon.startTime || currentDate > coupon.endTime) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Coupon is not valid at this time',
    );
  }

  if (coupon.timesUsed >= coupon.usageLimit) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Coupon usage limit has been reached',
    );
  }

  // Check if the coupon has already been applied to the order
  const isCouponAlreadyApplied = await prisma.userCoupon.findMany({
    where: {
      userId,
      couponId: coupon.id,
    },
  });

  if (isCouponAlreadyApplied.length === coupon.limitPerUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Coupon has already been applied to this order',
    );
  }

  // Check if minimum spend requirement is met
  if (totalPrice < coupon.minSpent) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Minimum spend of ${coupon.minSpent} is required to apply this coupon`,
    );
  }

  // Calculate discount based on priceType
  let discount = 0;
  if (coupon.priceType === 'percentage') {
    discount = (totalPrice * coupon.price) / 100;
  } else if (coupon.priceType === 'fixed') {
    discount = coupon.price;
  }

  // Apply capped price if applicable
  if (coupon.cappedPrice && discount > coupon.cappedPrice) {
    discount = coupon.cappedPrice;
  }

  // Update the order total price after applying the discount
  // const updatedTotalPrice = order.totalPrice - discount;

  // Create an OrderCoupon entry to track the applied coupon
  // await prisma.orderCoupon.create({
  //   data: {
  //     orderId: order.id,
  //     couponId: coupon.id,
  //   },
  // });

  // Update the order total price and increment coupon usage count
  // await prisma.order.update({
  //   where: { id: order.id },
  //   data: {
  //     totalPrice: updatedTotalPrice,
  //   },
  // });

  // await prisma.coupon.update({
  //   where: { id: coupon.id },
  //   data: {
  //     timesUsed: coupon.timesUsed + 1,
  //   },
  // });

  return {
    discount,
    coupon,
  };
};

const deleteMultipleData = async (ids: string[]) => {
  const result = await prisma.coupon.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  return result;
};

export const CouponService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  applyCoupon,
  deleteMultipleData,
};
