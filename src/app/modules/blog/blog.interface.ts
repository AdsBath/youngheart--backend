import { Blog } from '@prisma/client';

export type IBlog = {
  total: number;
  data: Blog[];
};
