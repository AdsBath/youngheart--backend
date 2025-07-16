import { AttributeItem, ProductAttribute } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IAttributeItem } from './attributeItem.interface';

const insertIntoDB = async (data: any): Promise<AttributeItem | null> => {
  const existingAttribute = await prisma.attributeItem.findFirst({
    where: {
      name: data.name,
    },
  });

  let result: AttributeItem;

  if (existingAttribute) {
    result = await prisma.attributeItem.update({
      where: {
        id: existingAttribute.id,
      },
      data,
    });
  } else {
    result = await prisma.attributeItem.create({
      data,
    });
  }

  return result;
};

const getAllFromDB = async (): Promise<IAttributeItem> => {
  const result = await prisma.attributeItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.attributeItem.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<ProductAttribute | null> => {
  const result = await prisma.attributeItem.findUnique({
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
  const result = await prisma.attributeItem.update({
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
  const result = await prisma.attributeItem.delete({
    where: {
      id,
    },
  });
  return result;
};

const deleteMultipleData = async (ids: string[]) => {
  await prisma.attributeItem.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  return {
    message: 'Collections deleted succesfully',
  };
};

export const AttributeItemService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  deleteMultipleData,
};
