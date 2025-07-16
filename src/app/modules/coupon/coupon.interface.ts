import { Coupon } from '@prisma/client';

export type ICoupon = {
  total: number;
  data: Coupon[];
};
