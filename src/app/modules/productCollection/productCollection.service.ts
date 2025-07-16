import { Prisma, ProductCollection } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import generateSlug from '../../../utils/generateSlug';
import { IProductCollection } from './productCollection.interface';

const insertIntoDB = async (
  data: ProductCollection,
): Promise<ProductCollection | null> => {
  const slug = generateSlug(data.name);
  data.slug = slug;
  const existingCollection = await prisma.productCollection.findFirst({
    where: {
      name: data.name,
      slug: slug,
    },
  });

  // let result: ProductCollection;

  const existingDisplayOrder = await prisma.productCollection.findFirst({
    where: {
      displayOrder: data?.displayOrder,
    },
  });

  if (existingDisplayOrder) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Already this display order Added!',
    );
  }

  if (existingCollection) {
    throw new ApiError(httpStatus.CONFLICT, 'Already Existing Collection!');
  }
  const result = await prisma.productCollection.create({
    data,
  });

  return result;
};

const getAllFromDB = async (
  searchText?: string,
): Promise<IProductCollection> => {
  let queryOptions: Prisma.ProductCollectionFindManyArgs = {};

  // Applying search functionality
  if (searchText) {
    queryOptions = {
      ...queryOptions,
      where: {
        OR: [
          { name: { contains: searchText } },
          // Add more fields if you want to search in additional fields
        ],
      },
    };
  }

  const result = await prisma.productCollection.findMany({
    ...queryOptions,
    orderBy: { displayOrder: 'asc' },
    include: {
      products: {
        orderBy: { createdAt: 'desc' },
        where: {
          showInHomeCollection: true,
        },
      },
      productProductCollections: {
        where: {
          product: {
            showInHomeCollection: true,
          },
        },
        include: {
          product: true,
        },
        orderBy: {
          product: { createdAt: 'desc' },
        },
      },
    },
  });

  const total = await prisma.productCollection.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<ProductCollection | null> => {
  const result = await prisma.productCollection.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        orderBy: { createdAt: 'desc' },
      },
      productProductCollections: {
        include: {
          product: true,
        },
        orderBy: {
          product: { createdAt: 'desc' },
        },
      },
    },
  });
  return result;
};

const updateOneInDB = async (
  data: ProductCollection,
  id: string,
): Promise<ProductCollection | null> => {
  const result = await prisma.productCollection.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (
  id: string,
): Promise<ProductCollection | null> => {
  const result = await prisma.productCollection.delete({
    where: {
      id,
    },
  });
  return result;
};

const deleteMultipleData = async (ids: string[]) => {
  await prisma.productCollection.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  return {
    message: 'Collections deleted succesfully',
  };
};

export const ProductCollectionService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  deleteMultipleData,
};
