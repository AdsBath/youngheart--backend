import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DiscountBannerService } from './discountBanner.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountBannerService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discount Banner data inserted successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountBannerService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discount Banner data fetched successfully',
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DiscountBannerService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discount Banner data fetched successfully',
    data: result,
  });
});

const getDiscountBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountBannerService.getDiscountBanner();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discount Banner data fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DiscountBannerService.updateOneInDB(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discount Banner data updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DiscountBannerService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Discount Banner data deleted successfully',
    data: result,
  });
});

export const DiscountBannerController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getDiscountBanner,
};
