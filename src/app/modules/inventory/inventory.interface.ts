import { Inventory } from '@prisma/client';

export type IInventory = {
  page: number;
  total: number;
  data: Inventory[];
};
