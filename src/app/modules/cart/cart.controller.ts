import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { createSession } from '../../../shared/createSession';
import sendResponse from '../../../shared/sendResponse';
import { CartService } from './cart.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { productId, sessionId, ...others } = req.body;

  if (!sessionId) {
    req.body.sessionId = await createSession();
  }

  const cartItem = await CartService.insertIntoDB(
    others,
    productId,
    req.body.sessionId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Data inserted successfully',
    data: { ...cartItem, sessionId: req.body.sessionId },
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // const { searchText, filters, sortBy } = req.query;
  const result = await CartService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Data fetched successfully',
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CartService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Data fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CartService.updateOneInDB(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Data updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CartService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Data deleted successfully',
    data: result,
  });
});

const incrementQuantity = catchAsync(async (req: Request, res: Response) => {
  const result = await CartService.incrementQuantity(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shopping cart item incremented successfully',
    data: result,
  });
});

const decrementQuantity = catchAsync(async (req: Request, res: Response) => {
  const result = await CartService.decrementQuantity(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shopping cart item decremented successfully',
    data: result,
  });
});

const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CartService.deleteCartItem(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart item deleted successfully',
    data: result,
  });
});

export const CartController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  incrementQuantity,
  decrementQuantity,
  deleteCartItem,
};
