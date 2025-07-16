import prisma from '../../../shared/prisma';
import { IProductProductCollection } from './productProductCollection.interface';

const getAllFromDB = async (): Promise<IProductProductCollection> => {
  const result = await prisma.productProductCollection.findMany({
    where: {
      product: {
        status: 'published',
      },
    },
  });

  const total = await prisma.productProductCollection.count({});

  return {
    total: total,
    data: result,
  };
};

export const ProductProductCollectionService = {
  getAllFromDB,
};
