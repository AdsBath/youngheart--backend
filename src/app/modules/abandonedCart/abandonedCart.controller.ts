import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AbandonCartService } from './abandonedCart.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const cartItem = await AbandonCartService.insertIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Abandoned Cart Data inserted successfully',
    data: cartItem,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AbandonCartService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Abandoned Cart Data fetched successfully',
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AbandonCartService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Abandoned Cart Data fetched successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AbandonCartService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Abandoned Cart Data deleted successfully',
    data: result,
  });
});

const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AbandonCartService.deleteCartItem(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Abandoned Cart item deleted successfully',
    data: result,
  });
});

export const AbandonCartController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteByIdFromDB,
  deleteCartItem,
};
