import { CartItem } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const incrementQuantity = async (data: {
  userId: string;
  productId: string;
}): Promise<CartItem | null> => {
  const { userId, productId } = data;

  const cart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shopping cart not created yet!');
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (cartItem) {
    const updatedQuantity = cartItem.quantity + 1;

    const updateResult = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: updatedQuantity,
      },
    });

    return updateResult;
  }

  throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found!');
};

const decrementQuantity = async (data: {
  userId: string;
  productId: string;
}): Promise<CartItem | null> => {
  const { userId, productId } = data;

  const cart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shopping cart not created yet!');
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (cartItem && cartItem.quantity > 1) {
    const updatedQuantity = cartItem.quantity - 1;

    const updateResult = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: updatedQuantity,
      },
    });

    return updateResult;
  }

  if (cartItem && cartItem.quantity === 1) {
    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return null;
  }

  throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found!');
};

export const CartItemService = {
  incrementQuantity,
  decrementQuantity,
};
