import { Blog } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import generateSlug from '../../../utils/generateSlug';
import { IBlog } from './blog.interface';

const insertIntoDB = async (data: Blog): Promise<Blog | null> => {
  const slug = generateSlug(data.title);
  data.slug = slug;
  const existingBlog = await prisma.blog.findFirst({
    where: {
      slug,
    },
  });

  if (existingBlog) {
    throw new ApiError(httpStatus.CONFLICT, 'Already this title Added!');
  }

  const blog = await prisma.blog.create({
    data: {
      ...data,
    },
  });

  return blog;
};

const getAllFromDB = async (): Promise<IBlog> => {
  const result = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
    },
  });

  const total = await prisma.blog.count({});

  return {
    total: total,
    data: result,
  };
};

const getAllForFrontend = async (): Promise<IBlog> => {
  const result = await prisma.blog.findMany({
    where: {
      isActive: true,
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.blog.count({
    where: {
      isActive: true,
    },
  });

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });
  return result;
};

const getBySlugFromDB = async (slug: string): Promise<Blog | null> => {
  const result = await prisma.blog.findFirst({
    where: {
      slug,
    },
    include: {
      author: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: Partial<Blog>,
  id: string,
): Promise<Blog | null> => {
  const existingBlog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!existingBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found!');
  }

  const result = await prisma.blog.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Blog | null> => {
  const existingBlog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!existingBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found!');
  }

  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BlogService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getAllForFrontend,
  getBySlugFromDB,
};
