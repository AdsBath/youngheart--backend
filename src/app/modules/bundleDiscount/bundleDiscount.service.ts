import { BundleDiscount } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import generateSlug from '../../../utils/generateSlug';
import { IBundleDiscount } from './bundleDiscount.interface';

const insertIntoDB = async (
  data: BundleDiscount,
): Promise<BundleDiscount | null> => {
  const slug = generateSlug(data.name);
  const existingBundleDiscount = await prisma.bundleDiscount.findUnique({
    where: {
      slug,
    },
  });
  if (existingBundleDiscount) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Already have a name in the bundle',
    );
  }
  data.slug = slug;
  const result = await prisma.bundleDiscount.create({
    data,
  });
  return result;
};

const getAllFromDB = async (): Promise<IBundleDiscount> => {
  const result = await prisma.bundleDiscount.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  const total = await prisma.bundleDiscount.count();
  return {
    total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<BundleDiscount | null> => {
  const result = await prisma.bundleDiscount.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: BundleDiscount,
  id: string,
): Promise<BundleDiscount | null> => {
  const slug = generateSlug(data.name);
  data.slug = slug;
  const result = await prisma.bundleDiscount.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<BundleDiscount | null> => {
  const result = await prisma.bundleDiscount.delete({
    where: {
      id,
    },
  });
  return result;
};

const deleteMultipleData = async (ids: string[]) => {
  const result = await prisma.bundleDiscount.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  return result;
};

export const BundleDiscountService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  deleteMultipleData,
};
