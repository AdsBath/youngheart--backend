import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './product.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product data inserted successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  //  search query and collection
  const search = req.query.q as string;
  const collection = req.query.collection as string;

  const result = await ProductService.getAllFromDB(search, collection);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product data fetched successfully',
    data: result,
  });
});

const getRelatedProductFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.categoryId;
    const result = await ProductService.getRelatedProductFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Related Product data fetched successfully',
      data: result,
    });
  },
);
const getProductsByCollection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductService.getProductsByCollection();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Collection Group Product data fetched successfully',
      data: result,
    });
  },
);
const getOfferProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getOfferProduct();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer Product data fetched successfully',
    data: result,
  });
});
const getAllOfferProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllOfferProduct();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer Product data fetched successfully',
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product data fetched successfully',
    data: result,
  });
});

const getProductByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  // console.log(slug)
  const result = await ProductService.getProductByIdFromDB(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product data fetched successfully!',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductService.updateOneInDB(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product data updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product data deleted successfully',
    data: result,
  });
});

const deleteMultiple = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.deleteMultipleData(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product data deleted successfully',
    data: result,
  });
});

export const ProductController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getProductByIdFromDB,
  getRelatedProductFromDB,
  getProductsByCollection,
  getOfferProduct,
  deleteMultiple,
  getAllOfferProduct,
};
