import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './order.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order data inserted successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // const { searchText, filters, sortBy } = req.query;
  const result = await OrderService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order data fetched successfully',
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await OrderService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order data fetched successfully',
    data: result,
  });
});

const getOrderByOrderId = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  const result = await OrderService.getOrderByOrderId(orderId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order data fetched successfully',
    data: result,
  });
});

const getMyOrderByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  const result = await OrderService.getMyOrderByIdFromDB(orderId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Order data fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await OrderService.updateOneInDB(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order data updated successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  // console.log({id}, req.body)

  const result = await OrderService.updateOrderStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await OrderService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order data deleted successfully',
    data: result,
  });
});

const getMyOrder = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.query;

  const result = await OrderService.getMyOrder(sessionId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Order data fatched successfully',
    data: result,
  });
});

const oderOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.oderOverview();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order overview data fatched successfully',
    data: result,
  });
});
const orderAnalytics = catchAsync(async (req: Request, res: Response) => {
  const value = req.query.value as string;
  // console.log(value, 'value');
  const result = await OrderService.orderAnalytics(value);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order analytic data fatched successfully',
    data: result,
  });
});

const getDailyDataForMonth = catchAsync(async (req: Request, res: Response) => {
  const { year, month } = req.query;
  // const month = req.params.month;
  const result = await OrderService.getDailyDataForMonth(
    Number(year),
    Number(month),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order monthly data fatched successfully',
    data: result,
  });
});

const getTopTenProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getTopTenProducts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top ten category data fatched successfully',
    data: result,
  });
});
const getTopTenCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getTopTenCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top ten category data fatched successfully',
    data: result,
  });
});

const deleteMultipleData = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.deleteMultipleData(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order data deleted successfully',
    data: result,
  });
});

export const OrderController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getMyOrderByIdFromDB,
  getOrderByOrderId,
  updateOrderStatus,
  getMyOrder,
  oderOverview,
  orderAnalytics,
  getDailyDataForMonth,
  getTopTenCategories,
  getTopTenProducts,
  deleteMultipleData,
};
