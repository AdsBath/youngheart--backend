import { CartItem } from '@prisma/client';

export type ICartItem = {
  total: number;
  data: CartItem[];
};
