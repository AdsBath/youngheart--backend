import { Page } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IPage } from './page.interface';

const insertIntoDB = async (data: Page): Promise<Page | null> => {
  const existingDisplayOrder = await prisma.page.findFirst({
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

  const result = await prisma.page.create({
    data: {
      ...data,
    },
  });

  return result;
};

const getAllFromDB = async (): Promise<IPage> => {
  const result = await prisma.page.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const total = await prisma.page.count({});

  return {
    total: total,
    data: result,
  };
};

const getAllForFrontend = async (): Promise<IPage> => {
  const result = await prisma.page.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  });

  const total = await prisma.page.count({
    where: {
      isActive: true,
    },
  });

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Page | null> => {
  const result = await prisma.page.findFirst({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<Page>,
  id: string,
): Promise<Page | null> => {
  const result = await prisma.page.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Page | null> => {
  const result = await prisma.page.delete({
    where: {
      id,
    },
  });
  return result;
};

export const PageService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getAllForFrontend,
};
