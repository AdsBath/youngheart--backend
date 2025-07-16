import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { deleteImageServices } from './image.service';

export const deleteImage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const public_id = req.params.publicId;
    const result = await deleteImageServices(public_id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Image Deleted Successfully!',
      data: result,
    });
  },
);
