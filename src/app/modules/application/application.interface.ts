import { Application } from '@prisma/client';

export type IApplication = {
  total: number;
  data: Application[];
};
