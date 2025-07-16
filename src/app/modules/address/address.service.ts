import { Address } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IAddress } from './address.interface';

const insertIntoDB = async (data: any): Promise<Address | null> => {
  const { userId, ...addressData } = data;
  const existingAddress = await prisma.address.findFirst({
    where: {
      userId,
    },
  });

  let addressResult: Address;

  if (existingAddress) {
    addressResult = await prisma.address.update({
      where: {
        id: existingAddress.id,
      },
      data: addressData,
    });
  } else {
    addressResult = await prisma.address.create({
      data,
    });
  }

  return addressResult;
};

const getAllFromDB = async (): Promise<IAddress> => {
  const result = await prisma.address.findMany({
    orderBy: { id: 'desc' },
  });

  const total = await prisma.address.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Address | null> => {
  const result = await prisma.address.findFirst({
    where: {
      userId: id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Address,
  id: string,
): Promise<Address | null> => {
  const result = await prisma.address.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Address | null> => {
  const result = await prisma.address.delete({
    where: {
      id,
    },
  });
  return result;
};

export const AddressService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
