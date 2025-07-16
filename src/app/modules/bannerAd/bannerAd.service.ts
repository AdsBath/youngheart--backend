import { BannerAd } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IBannerAd } from './bannerAd.interface';

const insertIntoDB = async (data: BannerAd): Promise<BannerAd | null> => {
  const existingCategory = await prisma.bannerAd.findFirst({
    where: {
      categoryId: data?.categoryId,
    },
  });

  if (existingCategory) {
    throw new ApiError(httpStatus.CONFLICT, 'Already this category Added!');
  }

  const existingDisplayOrder = await prisma.bannerAd.findFirst({
    where: {
      displayOrder: data?.displayOrder,
    },
  });

  if (existingDisplayOrder) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Already this display order Added!',
    );
  }

  const newBannerAd = await prisma.bannerAd.create({
    data: {
      ...data,
    },
  });

  return newBannerAd;
};

const getAllFromDB = async (): Promise<IBannerAd> => {
  const result = await prisma.bannerAd.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      category: true,
    },
  });

  const total = await prisma.bannerAd.count({});

  return {
    total: total,
    data: result,
  };
};

const getAllForFrontend = async (): Promise<IBannerAd> => {
  const result = await prisma.bannerAd.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  });

  const total = await prisma.bannerAd.count({
    where: {
      isActive: true,
    },
  });

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<BannerAd | null> => {
  const result = await prisma.bannerAd.findFirst({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<BannerAd>,
  id: string,
): Promise<BannerAd | null> => {
  const result = await prisma.bannerAd.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<BannerAd | null> => {
  const result = await prisma.bannerAd.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BannerAdService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getAllForFrontend,
};
