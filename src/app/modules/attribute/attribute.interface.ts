import { ProductAttribute } from '@prisma/client';

export type IAttribute = {
  total: number;
  data: ProductAttribute[];
};
