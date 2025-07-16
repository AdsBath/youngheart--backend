import { Order } from '@prisma/client';

export type IOrder = {
  total: number;
  data: Order[];
};
