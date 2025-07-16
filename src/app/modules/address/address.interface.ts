import { Address } from '@prisma/client';

export type IAddress = {
  total: number;
  data: Address[];
};
