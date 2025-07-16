import { AbandonedCart, AbandonedCartItem } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IAbandonCart } from './abandonedCart.interface';

const insertIntoDB = async (data: any): Promise<AbandonedCart | null> => {
  const { products, ...others } = data;
  const existingAbandonedCart = await prisma.abandonedCart.findFirst({
    where: {
      userId: data?.userId,
    },
  });

  let abandonedCart: any;

  if (existingAbandonedCart) {
    // Update the existing abandoned cart
    abandonedCart = await prisma.abandonedCart.update({
      where: {
        id: existingAbandonedCart.id,
      },
      data: others,
    });

    if (abandonedCart) {
      // Delete existing items
      await prisma.abandonedCartItem.deleteMany({
        where: {
          abandonedCartId: abandonedCart.id,
        },
      });

      // Create new items
      await Promise.all(
        products.map(async (product: any) => {
          await prisma.abandonedCartItem.create({
            data: {
              productId: product?.productId,
              quantity: product.quantity,
              color: product.color,
              size: product.size,
              price: product.price,
              abandonedCartId: abandonedCart.id,
            },
          });
        }),
      );
    }
  } else {
    // Create a new abandoned cart
    abandonedCart = await prisma.abandonedCart.create({
      data: others,
    });

    if (abandonedCart) {
      // Create new items
      await Promise.all(
        products.map(async (product: any) => {
          await prisma.abandonedCartItem.create({
            data: {
              productId: product?.productId,
              quantity: product.quantity,
              color: product.color,
              size: product.size,
              abandonedCartId: abandonedCart.id,
            },
          });
        }),
      );
    }
  }

  return abandonedCart;
};

const getAllFromDB = async (): Promise<IAbandonCart> => {
  const result = await prisma.abandonedCart.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      abandonedCartItems: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  const total = await prisma.abandonedCart.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<AbandonedCart | null> => {
  const result = await prisma.abandonedCart.findFirst({
    where: {
      userId: id,
    },
    include: {
      abandonedCartItems: true,
    },
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<AbandonedCart | null> => {
  const abandonCart = await prisma.abandonedCart.findUnique({
    where: {
      id,
    },
  });

  if (!abandonCart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Abandoned Cart not found');
  }

  await prisma.abandonedCartItem.deleteMany({
    where: {
      abandonedCartId: abandonCart.id,
    },
  });

  const result = await prisma.abandonedCart.delete({
    where: {
      id,
    },
  });
  return result;
};

const deleteCartItem = async (
  id: string,
): Promise<AbandonedCartItem | null> => {
  const result = await prisma.abandonedCartItem.delete({
    where: {
      id,
    },
  });
  return result;
};

export const AbandonCartService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteByIdFromDB,
  deleteCartItem,
};
