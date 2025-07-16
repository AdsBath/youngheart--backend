"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const createSession_1 = require("../../../shared/createSession");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
// User registration
const register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.sessionId) {
        req.body.sessionId = yield (0, createSession_1.createSession)();
    }
    const result = yield auth_service_1.AuthService.register(req.body);
    const { refreshToken } = result;
    // set refresh token into cookie
    // const cookieOptions = {
    //   secure: config.env === 'production',
    //   httpOnly: true,
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day in milliseconds
    // };
    // res.cookie('refreshToken', refreshToken, cookieOptions);
    // res.cookie('sessionId', sessionId, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
}));
// login
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.login(req.body);
    const { refreshToken, sessionId } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User login successfully',
        data: {
            accessToken: result.accessToken,
            refreshToken,
            sessionId,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        },
    });
}));
const checkoutLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.checkoutLogin(req.body);
    const { refreshToken, sessionId } = result;
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day in milliseconds
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('sessionId', sessionId, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User login successfully',
        data: {
            accessToken: result.accessToken,
        },
    });
}));
// logout
const logout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('[logout] req.cookies');
    res.clearCookie('refreshToken');
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logout successfully!',
    });
}));
// Admin registration
const registerAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.registerAdmin(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin created successfully',
        data: result,
    });
}));
// admin login
const adminLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.adminLogin(req.body);
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
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin login successfully',
        data: {
            accessToken,
            refreshToken,
            sessionId,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        },
    });
}));
// forgotPassword
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.AuthService.forgotPassword(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result,
    });
}));
// admin forgot Password
const adminForgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.AuthService.adminForgotPassword(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result,
    });
}));
// change password
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield auth_service_1.AuthService.changePassword(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Change successfully!',
        data: result,
    });
}));
// set password
const setPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield auth_service_1.AuthService.setPassword(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password set successfully!',
        data: result,
    });
}));
const mailTest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.mailTest();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Mail sent successfully!',
        data: result,
    });
}));
// all get user
exports.AuthController = {
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
