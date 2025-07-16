import { ProductProductCollection } from '@prisma/client';

export type IProductProductCollection = {
  total: number;
  data: ProductProductCollection[];
};
