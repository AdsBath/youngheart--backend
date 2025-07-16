import { Banner } from '@prisma/client';

export type IBanner = {
  total: number;
  data: Banner[];
};
