import { Cart, CartItem } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ICart } from './cart.interface';

const insertIntoDB = async (
  data: any,
  productId: string,
  sessionId?: string,
): Promise<CartItem | null> => {
  const user = await prisma.user.findUnique({ where: { sessionId } });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }

  let cart = await prisma.cart.findFirst({ where: { userId: user.id } });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id, sessionId },
    });
  }

  let cartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (cartItem) {
    cartItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: cartItem.quantity + 1,
      },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        quantity: data.quantity,
        cartId: cart.id,
        color: data.color,
        size: data.size,
        price: data.price,
        productId,
        discount: data.discount,
        discountAmmount: data.discountAmmount,
        image: data.image,
        name: data.name,
      },
    });
  }

  return cartItem;
};

const getAllFromDB = async (): Promise<ICart> => {
  const result = await prisma.cart.findMany({
    orderBy: { id: 'desc' },
    include: {
      cartItems: true,
      user: true,
    },
  });

  const total = await prisma.cart.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Cart | null> => {
  const result = await prisma.cart.findFirst({
    where: {
      userId: id,
    },
    include: {
      user: true,
      cartItems: {
        include: {
          product: {
            include: {
              shippingRules: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const updateOneInDB = async (data: Cart, id: string): Promise<Cart | null> => {
  const result = await prisma.cart.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Cart | null> => {
  const result = await prisma.cart.delete({
    where: {
      id,
    },
  });
  return result;
};

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
    // const updatedQuantity = cartItem.quantity + 1;

    const updateResult = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: {
          increment: 1,
        },
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
    const updateResult = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: {
          decrement: 1,
        },
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

const deleteCartItem = async (id: string): Promise<CartItem | null> => {
  const result = await prisma.cartItem.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CartService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  incrementQuantity,
  decrementQuantity,
  deleteCartItem,
};
