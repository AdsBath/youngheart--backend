import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BlogService } from './blog.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog data inserted successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog data fetched successfully',
    data: result,
  });
});

const getAllForFrontend = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getAllForFrontend();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog data fetched successfully',
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog data fetched successfully',
    data: result,
  });
});

const getBySlugFromDB = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await BlogService.getBySlugFromDB(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog data fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BlogService.updateOneInDB(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog data updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog data deleted successfully',
    data: result,
  });
});

export const BlogController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getAllForFrontend,
  getBySlugFromDB,
};
