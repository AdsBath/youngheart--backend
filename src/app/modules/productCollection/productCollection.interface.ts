import { ProductCollection } from '@prisma/client';

export type IProductCollection = {
  total: number;
  data: ProductCollection[];
};
