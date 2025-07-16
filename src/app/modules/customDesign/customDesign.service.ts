import { CustomDesign } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { ICustomDesign } from './customDesign.interface';

const insertIntoDB = async (data: any): Promise<CustomDesign> => {
  const result = await prisma.customDesign.create({
    data,
  });

  return result;
};

const getAllFromDB = async (): Promise<ICustomDesign> => {
  const result = await prisma.customDesign.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.customDesign.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<CustomDesign | null> => {
  const result = await prisma.customDesign.findFirst({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<any>,
  id: string,
): Promise<CustomDesign | null> => {
  const result = await prisma.customDesign.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<CustomDesign | null> => {
  const result = await prisma.customDesign.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CustomDesignService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
