import { DiscountBanner } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import generateSlug from '../../../utils/generateSlug';
import { IDiscountBanner } from './discountBanner.interface';

const insertIntoDB = async (
  data: DiscountBanner,
): Promise<DiscountBanner | null> => {
  const slug = generateSlug(data.name);
  const existingDiscountBanner = await prisma.discountBanner.findUnique({
    where: {
      slug,
    },
  });
  if (existingDiscountBanner) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Already have a name in the discount banner',
    );
  }
  data.slug = slug;
  const result = await prisma.discountBanner.create({
    data,
  });
  return result;
};

const getAllFromDB = async (): Promise<IDiscountBanner> => {
  const result = await prisma.discountBanner.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  const total = await prisma.discountBanner.count();
  return {
    total,
    data: result,
  };
};

const getDiscountBanner = async (): Promise<DiscountBanner | null> => {
  const result = await prisma.discountBanner.findFirst({
    where: {
      status: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discount Banner not found');
  }
  return result;
};

const getByIdFromDB = async (id: string): Promise<DiscountBanner | null> => {
  const result = await prisma.discountBanner.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: DiscountBanner,
  id: string,
): Promise<DiscountBanner | null> => {
  const slug = generateSlug(data.name);
  data.slug = slug;
  const result = await prisma.discountBanner.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<DiscountBanner | null> => {
  const result = await prisma.discountBanner.delete({
    where: {
      id,
    },
  });
  return result;
};

export const DiscountBannerService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getDiscountBanner,
};
