import { AttributeItem } from '@prisma/client';

export type IAttributeItem = {
  total: number;
  data: AttributeItem[];
};
