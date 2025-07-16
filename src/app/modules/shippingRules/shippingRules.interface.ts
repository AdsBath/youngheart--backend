import { ShippingRule } from '@prisma/client';

export type IShippingRules = {
  total: number;
  data: ShippingRule[];
};
