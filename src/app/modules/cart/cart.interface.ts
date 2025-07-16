import { Cart } from '@prisma/client';

export type ICart = {
  total: number;
  data: Cart[];
};
