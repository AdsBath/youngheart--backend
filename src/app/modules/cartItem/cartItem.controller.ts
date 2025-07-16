import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CartItemService } from './cartItem.service';

const incrementQuantity = catchAsync(async (req: Request, res: Response) => {
  const result = await CartItemService.incrementQuantity(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shopping cart item incremented successfully',
    data: result,
  });
});

const decrementQuantity = catchAsync(async (req: Request, res: Response) => {
  const result = await CartItemService.decrementQuantity(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shopping cart item decremented successfully',
    data: result,
  });
});

export const CartItemController = {
  decrementQuantity,
  incrementQuantity,
};
