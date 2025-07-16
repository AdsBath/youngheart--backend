import { Banner } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IBanner } from './banner.interface';

const insertIntoDB = async (data: Banner): Promise<Banner | null> => {
  const lastBanner = await prisma.banner.findFirst({
    orderBy: {
      displayOrder: 'desc',
    },
  });

  // Determine the new displayOrder value
  const newDisplayOrder = lastBanner ? lastBanner.displayOrder + 1 : 1;

  // Create the new banner with the incremented displayOrder value
  const newBanner = await prisma.banner.create({
    data: {
      ...data,
      displayOrder: newDisplayOrder,
    },
  });
  return newBanner;
};

const getAllFromDB = async (): Promise<IBanner> => {
  const result = await prisma.banner.findMany({
    orderBy: { id: 'desc' },
  });

  const total = await prisma.banner.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Banner | null> => {
  const result = await prisma.banner.findFirst({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<Banner>,
  id: string,
): Promise<Banner | null> => {
  const result = await prisma.banner.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Banner | null> => {
  const result = await prisma.banner.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BannerService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
