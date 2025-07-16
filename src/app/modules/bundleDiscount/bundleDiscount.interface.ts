import { BundleDiscount } from '@prisma/client';

export type IBundleDiscount = {
  total: number;
  data: BundleDiscount[];
};
