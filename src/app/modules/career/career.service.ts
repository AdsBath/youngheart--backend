import { Career } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { ICareer } from './career.interface';

const insertIntoDB = async (data: Career): Promise<Career | null> => {
  const result = await prisma.career.create({
    data: {
      ...data,
    },
  });

  return result;
};

const getAllFromDB = async (): Promise<ICareer> => {
  const result = await prisma.career.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.career.count({});

  return {
    total: total,
    data: result,
  };
};

const getAllForFrontend = async (): Promise<ICareer> => {
  const result = await prisma.career.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.career.count({
    where: {
      isActive: true,
    },
  });

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Career | null> => {
  const result = await prisma.career.findFirst({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<Career>,
  id: string,
): Promise<Career | null> => {
  const result = await prisma.career.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Career | null> => {
  const result = await prisma.career.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CareerService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getAllForFrontend,
};
