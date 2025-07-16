import { DiscountBanner } from '@prisma/client';

export type IDiscountBanner = {
  total: number;
  data: DiscountBanner[];
};
