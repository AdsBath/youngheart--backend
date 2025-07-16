import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { InventoryService } from './inventory.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const insertIntoDb: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InventoryService.insertIntoDb(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Inventory created successfully!',
      data: result,
    });
  },
);

const getAllFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationFields);
    const result = await InventoryService.getAllFromDB(paginationOptions);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Inventory data fatched successfully!',
      data: result,
    });
  },
);

const getDataByIdFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InventoryService.getDataByIdFromDB(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Inventory data fatched successfully!',
      data: result,
    });
  },
);

const updateByIdFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InventoryService.updateByIdFromDB(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Inventory updated successfully!',
      data: result,
    });
  },
);

const deleteByIdFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await InventoryService.deleteByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Inventory data deleted successfully!',
      data: result,
    });
  },
);

const createInventoryNote: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InventoryService.createInventoryNote(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Inventory Note created successfully!',
      data: result,
    });
  },
);

const getInventoryNoteById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InventoryService.getInventoryNoteById(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Inventory note data fatched successfully!',
      data: result,
    });
  },
);

const updateInventoryNote: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InventoryService.updateInventoryNote(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Inventory Note updated successfully!',
      data: result,
    });
  },
);

export const InventoryController = {
  getAllFromDB,
  insertIntoDb,
  deleteByIdFromDB,
  getDataByIdFromDB,
  updateByIdFromDB,
  createInventoryNote,
  updateInventoryNote,
  getInventoryNoteById,
};
