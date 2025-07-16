import httpStatus from 'http-status';

import { Request, RequestHandler, Response } from 'express';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import { createSession } from '../../../shared/createSession';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

// User registration
const register: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.body.sessionId) {
      req.body.sessionId = await createSession();
    }
    const result = await AuthService.register(req.body);
    const { refreshToken } = result;

    // set refresh token into cookie
    // const cookieOptions = {
    //   secure: config.env === 'production',
    //   httpOnly: true,
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day in milliseconds
    // };
    // res.cookie('refreshToken', refreshToken, cookieOptions);
    // res.cookie('sessionId', sessionId, cookieOptions);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User register successfully',
      data: {
        accessToken: result.accessToken,
        data: result.result,
        refreshToken,
        sessionId: req.body.sessionId,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    });
  },
);

// login
const login: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    const { refreshToken, sessionId } = result;

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User login successfully',
      data: {
        accessToken: result.accessToken,
        refreshToken,
        sessionId,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    });
  },
);

const checkoutLogin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.checkoutLogin(req.body);
    const { refreshToken, sessionId } = result;
    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day in milliseconds
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('sessionId', sessionId, cookieOptions);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User login successfully',
      data: {
        accessToken: result.accessToken,
      },
    });
  },
);

// logout
const logout: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // console.log('[logout] req.cookies');

    res.clearCookie('refreshToken');

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Logout successfully!',
    });
  },
);

// Admin registration
const registerAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.registerAdmin(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully',
      data: result,
    });
  },
);

// admin login
const adminLogin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.adminLogin(req.body);
    const { accessToken, refreshToken, sessionId } = result;

    // set refresh token into cookie
    // const cookieOptions = {
    //   secure: false,
    //   httpOnly: true,
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day in milliseconds
    //   smesite: 'lax',
    //   domain: 'www.babukhusi.com',
    // };
    // console.log('Cookies being set:', {
    //   refreshToken,
    //   sessionId,
    //   cookieOptions,
    // });
    // res.cookie('refreshToken', refreshToken, cookieOptions);
    // res.cookie('sessionId', sessionId, cookieOptions);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin login successfully',
      data: {
        accessToken,
        refreshToken,
        sessionId,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    });
  },
);

// forgotPassword
const forgotPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  },
);

// admin forgot Password
const adminForgotPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.adminForgotPassword(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  },
);

// change password
const changePassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;
    const result = await AuthService.changePassword(data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password Change successfully!',
      data: result,
    });
  },
);

// set password
const setPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;
    const result = await AuthService.setPassword(data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password set successfully!',
      data: result,
    });
  },
);

const mailTest = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.mailTest();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mail sent successfully!',
    data: result,
  });
});

// all get user
export const AuthController = {
  mailTest,
  registerAdmin,
  adminLogin,
  forgotPassword,
  login,
  register,
  logout,
  changePassword,
  checkoutLogin,
  adminForgotPassword,
  setPassword,
};
