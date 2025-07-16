import { Category, Product } from '@prisma/client';

export type ICategory = {
  total: number;
  childeren: ICategory[];
  data: Category[];
};

export type CategoryWithProducts = {
  category: Category | null;
  products: Product[];
};
