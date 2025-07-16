import { ShippingRule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IShippingRules } from './shippingRules.interface';

const insertIntoDB = async (data: any): Promise<ShippingRule | null> => {
  const existingShippingRule = await prisma.shippingRule.findFirst({
    where: {
      name: data.name,
    },
  });

  let result: ShippingRule;

  if (existingShippingRule) {
    result = await prisma.shippingRule.update({
      where: {
        id: existingShippingRule.id,
      },
      data,
    });
  } else {
    result = await prisma.shippingRule.create({
      data,
    });
  }

  return result;
};

const getAllFromDB = async (): Promise<IShippingRules> => {
  const result = await prisma.shippingRule.findMany({
    orderBy: { id: 'desc' },
  });

  const total = await prisma.shippingRule.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<ShippingRule | null> => {
  const result = await prisma.shippingRule.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<ShippingRule>,
  id: string,
): Promise<ShippingRule | null> => {
  const result = await prisma.shippingRule.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<ShippingRule | null> => {
  const result = await prisma.shippingRule.delete({
    where: {
      id,
    },
  });
  return result;
};

const deleteMultipleData = async (ids: string[]) => {
  const result = await prisma.shippingRule.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  return result;
};

export const ShippingRulesService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  deleteMultipleData,
};
