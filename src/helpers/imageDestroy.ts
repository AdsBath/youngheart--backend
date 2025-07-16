import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dqblwuqh5',
  api_key: '818456321161821',
  api_secret: 'gL11adu0FybDYsmeL4Wv3hIayZk',
});

// delete image in cloudinary
export const imageDestroy = async (
  public_id: string,
): Promise<any | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error: Error, result: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
