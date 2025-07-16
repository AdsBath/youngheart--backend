import { Inventory, InventoryNote } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IInventory } from './inventory.interface';

const insertIntoDb = async (data: Inventory): Promise<Inventory | null> => {
  const result = await prisma.inventory.create({
    data,
  });

  return result;
};

const getAllFromDB = async (
  paginationOptions: IPaginationOptions,
): Promise<IInventory> => {
  // console.log(paginationOptions)
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const result = await prisma.inventory.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      product: true,
      inventoryNotes: true,
    },
    take: limit,
    skip: skip,
  });
  const total = await prisma.inventory.count();
  return {
    page,
    total,
    data: result,
  };
};

const getDataByIdFromDB = async (id: string): Promise<Inventory | null> => {
  const result = await prisma.inventory.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found!');
  }
  return result;
};

const updateByIdFromDB = async (
  id: string,
  payload: Partial<Inventory>,
): Promise<Inventory | null> => {
  const inventory = await prisma.inventory.findUnique({
    where: {
      id,
    },
  });
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found!');
  }

  const result = await prisma.inventory.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Inventory | null> => {
  const inventory = await prisma.inventory.findUnique({
    where: {
      id,
    },
  });

  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found!');
  }

  const result = await prisma.inventory.delete({
    where: {
      id: inventory.id,
    },
    include: {
      product: true,
    },
  });

  return result;
};

const createInventoryNote = async (
  data: InventoryNote,
): Promise<InventoryNote> => {
  const result = await prisma.inventoryNote.create({
    data,
  });

  return result;
};

const getInventoryNoteById = async (
  id: string,
): Promise<InventoryNote | null> => {
  const result = await prisma.inventoryNote.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory note not found!');
  }
  return result;
};

const updateInventoryNote = async (
  id: string,
  payload: Partial<InventoryNote>,
): Promise<InventoryNote | null> => {
  const inventory = await prisma.inventoryNote.findUnique({
    where: {
      id,
    },
  });
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory Note not found!');
  }

  const result = await prisma.inventoryNote.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

export const InventoryService = {
  getAllFromDB,
  insertIntoDb,
  deleteByIdFromDB,
  getDataByIdFromDB,
  updateByIdFromDB,
  createInventoryNote,
  updateInventoryNote,
  getInventoryNoteById,
};
