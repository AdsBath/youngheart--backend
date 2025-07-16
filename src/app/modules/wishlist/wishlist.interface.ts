import { Wishlist } from '@prisma/client';

export type IWishlist = {
  total: number;
  data: Wishlist[];
};
