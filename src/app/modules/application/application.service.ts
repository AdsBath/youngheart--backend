import { Application } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IApplication } from './application.interface';

const insertIntoDB = async (data: Application): Promise<Application | null> => {
  const result = await prisma.application.create({
    data: {
      ...data,
    },
  });

  return result;
};

const getAllFromDB = async (): Promise<IApplication> => {
  const result = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.application.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Application | null> => {
  const result = await prisma.application.findFirst({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<Application>,
  id: string,
): Promise<Application | null> => {
  const result = await prisma.application.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Application | null> => {
  const result = await prisma.application.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ApplicationService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
