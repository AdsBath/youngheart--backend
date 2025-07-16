import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import generateSlug from '../../../utils/generateSlug';
import { IBrand } from './brand.type';

const insertIntoDB = async (data: IBrand): Promise<IBrand | null> => {
  const slug = generateSlug(data.name);
  const existingbrand = await prisma.brand.findUnique({
    where: {
      slug,
    },
  });
  if (existingbrand) {
    throw new ApiError(httpStatus.CONFLICT, 'Already have a name in the brand');
  }
  data.slug = slug;
  const result = await prisma.brand.create({
    data,
  });
  return result;
};

const getAllFromDB = async (): Promise<{ data: IBrand[]; total: number }> => {
  const result = await prisma.brand.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  const total = await prisma.brand.count();
  return {
    total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<IBrand | null> => {
  const result = await prisma.brand.findUnique({
    where: {
      id,
    },
    include: {
      products: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: IBrand,
  id: string,
): Promise<IBrand | null> => {
  const slug = generateSlug(data.name);
  data.slug = slug;
  const result = await prisma.brand.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IBrand | null> => {
  const result = await prisma.brand.delete({
    where: {
      id,
    },
  });
  return result;
};

const deleteMultipleData = async (ids: string[]) => {
  const result = await prisma.brand.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  return result;
};

export const brandService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  deleteMultipleData,
};
