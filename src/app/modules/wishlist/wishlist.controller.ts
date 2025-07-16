import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WishlistService } from './wishlist.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist data inserted successfully',
    data: result,
  });
});

const getMyWishlistFromDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await WishlistService.getMyWishlistFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist data fetched successfully',
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await WishlistService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist data fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await WishlistService.updateOneInDB(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist data updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await WishlistService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist data deleted successfully',
    data: result,
  });
});

export const WishlistController = {
  insertIntoDB,
  getMyWishlistFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
