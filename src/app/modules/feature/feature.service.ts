import prisma from '../../../shared/prisma';
import generateSlug from '../../../utils/generateSlug';
import { IFeature } from './feature.type';

const insertFeatureIntoDB = async (data: IFeature): Promise<IFeature> => {
  data.slug = generateSlug(data.name);
  const result = await prisma.feature.create({
    data, // Pass the data object directly
  });
  return result;
};

const getAllFeaturesFromDB = async () => {
  return await prisma.feature.findMany({
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
};

// Get Feature by ID
const getFeatureByIdFromDB = async (id: string): Promise<IFeature | null> => {
  return await prisma.feature.findUnique({
    where: { id },
  });
};

// Update a Feature
const updateFeatureInDB = async (
  id: string,
  data: Partial<Omit<IFeature, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<IFeature | null> => {
  return await prisma.feature.update({
    where: { id },
    data,
  });
};

// Delete a Feature
const deleteFeatureFromDB = async (id: string): Promise<IFeature> => {
  return await prisma.feature.delete({
    where: { id },
  });
};

export const FeatureService = {
  insertFeatureIntoDB,
  getAllFeaturesFromDB,
  getFeatureByIdFromDB,
  updateFeatureInDB,
  deleteFeatureFromDB,
};
