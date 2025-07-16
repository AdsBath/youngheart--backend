import { Feature } from '@prisma/client';

export type IFeature = {
  // Optional: Exclude auto-generated fields (if they aren't provided during creation)
} & Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>;
