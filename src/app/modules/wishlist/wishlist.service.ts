import { Wishlist } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IWishlist } from './wishlist.interface';

const insertIntoDB = async (data: any): Promise<Wishlist | null> => {
  const existingWishlist = await prisma.wishlist.findFirst({
    where: {
      userId: data.userId,
      productId: data.productId,
    },
  });

  let result: Wishlist;

  if (existingWishlist) {
    result = await prisma.wishlist.delete({
      where: {
        id: existingWishlist.id,
      },
    });
  } else {
    result = await prisma.wishlist.create({
      data,
    });
  }

  return result;
};

const getMyWishlistFromDB = async (userId: string): Promise<IWishlist> => {
  const result = await prisma.wishlist.findMany({
    where: {
      userId,
    },
    include: {
      product: true,
    },
    orderBy: { id: 'desc' },
  });

  const total = await prisma.wishlist.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Wishlist | null> => {
  const result = await prisma.wishlist.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<Wishlist>,
  id: string,
): Promise<Wishlist | null> => {
  const result = await prisma.wishlist.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Wishlist | null> => {
  const existingWishlist = await prisma.wishlist.findUnique({
    where: {
      id,
    },
  });
  if (!existingWishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found!');
  }
  const result = await prisma.wishlist.delete({
    where: {
      id,
    },
  });
  return result;
};

export const WishlistService = {
  insertIntoDB,
  getMyWishlistFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
