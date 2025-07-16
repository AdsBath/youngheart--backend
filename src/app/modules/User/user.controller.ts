import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const insertIntoDb: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.insertIntoDb(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully',
      data: result,
    });
  },
);

const getAllData: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.getAllData();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user fetched successfully',
      data: result,
    });
  },
);

const getUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await UserService.getUserById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user fetched successfully',
      data: result,
    });
  },
);

const getMe: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // const sessionId = req.cookies["sessionId"] as string;

    const id = req.query.id;
    console.log({ id });
    const result = await UserService.getMe(id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'get my data successfully',
      data: result,
    });
  },
);

const getUserBySessionId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const sessionId = req.params.id;

    const result = await UserService.getUserBySessionId(sessionId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user fetched successfully by sessionId',
      data: result,
    });
  },
);

const deleteUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await UserService.deleteUser(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User delete successfully',
      data: result,
    });
  },
);

const updateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const result = await UserService.updateUser(id, data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  },
);

const allAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.allAdmin();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All user get successfully',
      data: result,
    });
  },
);

const adminProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const authToken = req.headers.authorization as string;
    const sessionId = req.cookies['sessionId'] as string;
    const result = await UserService.adminProfile(authToken, sessionId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User get successfully',
      data: result,
    });
  },
);

const getAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await UserService.getAdminById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin get successfully',
      data: result,
    });
  },
);

const deleteAllAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await UserService.deleteAllAdmin(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Admin delete successfully',
      data: result,
    });
  },
);

const deleteMultipleRegisterUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.deleteMultipleRegisterData(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Register delete successfully',
      data: result,
    });
  },
);
const deleteMultipleGuestUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.deleteMultipleRegisterData(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Register delete successfully',
      data: result,
    });
  },
);

export const UserController = {
  insertIntoDb,
  getAllData,
  deleteUser,
  updateUser,
  getUserBySessionId,
  getUserById,
  getAdminById,
  getMe,
  allAdmin,
  deleteAllAdmin,
  adminProfile,
  deleteMultipleRegisterUser,
  deleteMultipleGuestUser,
};
