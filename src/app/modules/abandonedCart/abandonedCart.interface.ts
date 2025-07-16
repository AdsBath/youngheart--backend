import { AbandonedCart } from '@prisma/client';

export type IAbandonCart = {
  total: number;
  data: AbandonedCart[];
};
