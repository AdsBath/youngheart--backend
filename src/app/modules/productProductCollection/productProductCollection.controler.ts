import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductProductCollectionService } from './productProductCollection.service';

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductProductCollectionService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product product Collection featched successfully!',
    data: result,
  });
});

export const ProductProductCollectionController = {
  getAllFromDB,
};
