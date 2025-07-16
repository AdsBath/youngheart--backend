import { imageDestroy } from '../../../helpers/imageDestroy';

export const deleteImageServices = async (publicId: string) => {
  const result = await imageDestroy(publicId);
  return result;
};
