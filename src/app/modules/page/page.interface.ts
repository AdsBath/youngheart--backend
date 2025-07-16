import { Page } from '@prisma/client';

export type IPage = {
  total: number;
  data: Page[];
};
