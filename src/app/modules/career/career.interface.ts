import { Career } from '@prisma/client';

export type ICareer = {
  total: number;
  data: Career[];
};
