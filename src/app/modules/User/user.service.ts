import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (data: User): Promise<User> => {
  if (!data.sessionId) {
    throw new ApiError(httpStatus.CONFLICT, 'SessionId is required!');
  }
  const result = await prisma.user.create({ data });
  return result;
};
// admin all
const allAdmin = async () => {
  // Role.ADMIN || Role.EMPLOYEE || Role.MANAGER
  const result = await prisma.user.findMany({
    where: {
      OR: [
        { role: 'ADMIN' },
        { role: 'EMPLOYEE' },
        { role: 'MANAGER' },
        { role: 'SUPER_ADMIN' },
      ],
    },
  });
  return result;
};
// admin me
const adminProfile = async (authToken: string, sessionId: string) => {
  const decoded = jwtHelpers.verifyToken(
    authToken,
    config.jwt.secret as Secret,
  );
  const { userId, role } = decoded;
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
      role,
      sessionId,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  return result;
};

const getAllData = async () => {
  const result = await prisma.user.findMany();

  const total = await prisma.user.count();

  return { total, data: result };
};

const getMe = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      sessionId: id,
    },
    select: {
      id: true,
      phone: true,
      email: true,
      firstName: true,
      lastName: true,
      displayName: true,
      image: true,
      role: true,
      isUser: true,
      sessionId: true,
      loginCount: true,
      lastLogin: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      orders: true,
    },
  });

  return result;
};

const getUserById = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<User>,
): Promise<User | null> => {
  if (payload?.email) {
    payload.email = payload.email.toLowerCase();

    const isExist = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (isExist) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already exists!');
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteUser = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const result = await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  return result;
};

const getUserBySessionId = async (sessionId: string) => {
  if (!sessionId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'SessionId is required!');
  }
  const result = await prisma.user.findUnique({ where: { sessionId } });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found!');
  }
  return result;
};

const deleteAllAdmin = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found!');
  }

  const result = await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  return result;
};

const getAdminById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const deleteMultipleRegisterData = async (ids: string[]) => {
  const result = await prisma.user.deleteMany({
    where: {
      role: 'USER',
      id: { in: ids },
    },
  });

  return result;
};
const deleteMultipleGuestData = async (ids: string[]) => {
  const result = await prisma.user.deleteMany({
    where: {
      role: 'GUEST',
      id: { in: ids },
    },
  });

  return result;
};

export const UserService = {
  insertIntoDb,
  getAllData,
  deleteUser,
  updateUser,
  getUserBySessionId,
  getUserById,
  getMe,
  allAdmin,
  deleteAllAdmin,
  adminProfile,
  getAdminById,
  deleteMultipleRegisterData,
  deleteMultipleGuestData,
};
