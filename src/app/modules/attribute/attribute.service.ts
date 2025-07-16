import { ProductAttribute } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IAttribute } from './attribute.interface';

const insertIntoDB = async (data: any): Promise<ProductAttribute | null> => {
  const existingAttribute = await prisma.productAttribute.findFirst({
    where: {
      name: data.name,
    },
  });

  let result: ProductAttribute;

  if (existingAttribute) {
    result = await prisma.productAttribute.update({
      where: {
        id: existingAttribute.id,
      },
      data,
    });
  } else {
    result = await prisma.productAttribute.create({
      data,
    });
  }

  return result;
};

const getAllFromDB = async (): Promise<IAttribute> => {
  const result = await prisma.productAttribute.findMany({
    include: {
      items: true,
    },
    orderBy: { id: 'desc' },
  });

  const total = await prisma.productAttribute.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<ProductAttribute | null> => {
  const result = await prisma.productAttribute.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<ProductAttribute>,
  id: string,
): Promise<ProductAttribute | null> => {
  const result = await prisma.productAttribute.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (
  id: string,
): Promise<ProductAttribute | null> => {
  const result = await prisma.productAttribute.delete({
    where: {
      id,
    },
  });
  return result;
};

export const AttributeService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
