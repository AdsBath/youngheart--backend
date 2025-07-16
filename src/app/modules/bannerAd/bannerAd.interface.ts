import { BannerAd } from '@prisma/client';

export type IBannerAd = {
  total: number;
  data: BannerAd[];
};
