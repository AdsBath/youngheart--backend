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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../shared/jwtHelpers");
const otpService_1 = require("../../../shared/otpService");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendEmail_1 = require("../../../shared/sendEmail");
const resettemplate_1 = require("../../../utils/resettemplate");
// register account
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    delete userData.confirmPassword;
    const { password, sessionId, phone } = userData;
    if (userData === null || userData === void 0 ? void 0 : userData.email) {
        userData.email = userData === null || userData === void 0 ? void 0 : userData.email.toLowerCase();
    }
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            phone,
        },
    });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Phone already exists. Please login!');
    }
    if (userData === null || userData === void 0 ? void 0 : userData.email) {
        const isEmailExist = yield prisma_1.default.user.findFirst({
            where: {
                email: userData.email,
            },
        });
        if (isEmailExist) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Email already exists. Please login!');
        }
    }
    if (!sessionId) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not created!');
    }
    const newUser = yield prisma_1.default.user.findFirst({
        where: {
            sessionId,
        },
    });
    if (!newUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (!password) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password is required');
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    userData.password = hashedPassword;
    userData.isUser = true;
    userData.role = client_1.Role.USER;
    const updateUser = yield prisma_1.default.user.update({
        where: {
            sessionId: newUser.sessionId,
        },
        data: userData,
    });
    const { id: userId, role } = updateUser;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, sessionId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, sessionId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return { accessToken, refreshToken, result: updateUser, sessionId };
});
// login
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let { email } = payload;
    const { password } = payload;
    if (email) {
        email = email.toLowerCase();
    }
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            OR: [{ email }, { phone: email }],
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
    }
    const isPasswordMatched = (givenPassword, savedPassword) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
    if (isUserExist.password &&
        !(yield isPasswordMatched(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password is incorrect');
    }
    yield prisma_1.default.user.update({
        where: {
            id: isUserExist.id,
        },
        data: {
            loginCount: {
                increment: 1,
            },
        },
    });
    const { id: userId, sessionId, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, sessionId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, sessionId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        sessionId,
    };
});
// login
const checkoutLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.email) {
        payload.email = payload.email.toLowerCase();
    }
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: { email: payload.email, sessionId: payload.sessionId },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
    }
    yield prisma_1.default.user.update({
        where: {
            id: isUserExist.id,
        },
        data: {
            loginCount: {
                increment: 1,
            },
        },
    });
    const { id: userId, sessionId, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, sessionId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, sessionId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        sessionId,
    };
});
// Function to register an admin
const registerAdmin = (adminData) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = adminData, userData = __rest(adminData, ["password"]);
    let { email } = adminData;
    if (email) {
        email = email.toLowerCase();
    }
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Email already exists. Please login!');
    }
    // const sendPassword = generatePassword();
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    const sessionId = (0, uuid_1.v4)();
    const admin = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, userData), { sessionId,
            email, password: hashedPassword, isUser: true }),
    });
    // send email
    yield (0, sendEmail_1.sendEmail)(email, 'Admin Registration Successful', `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
        <h1 style="color: #ff6f61;">Welcome to Our Team, ${admin.firstName}!</h1>
        <p style="color: #555;">We are thrilled to have you on board. Your account has been created successfully.</p>
        <div style="margin-top: 20px; background-color: #ffe6e6; padding: 15px; border-radius: 8px;">
          <p style="font-weight: bold;">Your temporary password is:</p>
          // <p style="color: #ff6f61; font-size: 18px;">12345678</p>
        </div>
        <p style="color: #555;">Please use this password to login to your account and make sure to change it after your first login for security purposes.</p>
        <p style="margin-top: 20px;">Thank you,</p>
        <p style="font-weight: bold; color: #ff6f61;">The Team</p>
      </div>
    </div>
  `);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin not created!');
    }
    return admin;
});
// admin login
const adminLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = payload;
    let { email } = payload;
    if (email) {
        email = email.toLowerCase();
    }
    const isPasswordMatched = (givenPassword, savedPassword) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: { email },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Admin not found');
    }
    if (isUserExist.role === client_1.Role.USER || isUserExist.role === client_1.Role.GUEST) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You don't have permission to login as admin");
    }
    if (isUserExist.password &&
        !(yield isPasswordMatched(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    yield prisma_1.default.user.update({
        where: { id: isUserExist.id },
        data: {
            loginCount: {
                increment: 1,
            },
            lastLogin: new Date(),
        },
    });
    const { id: userId, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        sessionId: isUserExist.sessionId,
    };
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        email = email.toLowerCase();
    }
    const user = yield prisma_1.default.user.findFirst({
        where: { email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role !== client_1.Role.GUEST && user.role !== client_1.Role.USER) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not a valid user!');
    }
    // Generate new OTP and update OTP secret and creation time
    const password = (0, otpService_1.generatePassword)();
    yield (0, sendEmail_1.sendEmail)(email, 'Your Password Reset', (0, resettemplate_1.resetTemplate)(password));
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
        },
    });
    // send otp
    // const token = jwtHelpers.createToken(
    //   { userId: user.id, role: user.role, email: user.email },
    //   config.jwt.secret as Secret,
    //   config.jwt.expires_in as string,
    // );
    // const resetPasswordLink = `${config.frontendUrlResetPasswordLink}/reset-password?token=${token}`;
    // // send email
    // await sendEmail(
    //   email,
    //   'Password Reset Request',
    //   `
    //   <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
    //     <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
    //       <h1 style="color: #ff6f61;">Password Reset Request</h1>
    //       <p style="color: #555;">Hi ${user.firstName},</p>
    //       <p style="color: #555;">We received a request to reset your password. Click the button below to reset it:</p>
    //       <div style="margin-top: 20px; text-align: center;">
    //         <a
    //           href="${resetPasswordLink}"
    //           style="display: inline-block; padding: 10px 20px; color: white; background-color: #ff6f61; border-radius: 5px; text-decoration: none; font-weight: bold;"
    //         >
    //           Reset Password
    //         </a>
    //       </div>
    //       <p style="margin-top: 20px; color: #555;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
    //       <p style="margin-top: 20px;">Thank you,</p>
    //       <p style="font-weight: bold; color: #ff6f61;">The Team</p>
    //     </div>
    //   </div>
    // `,
    // );
    return { message: 'Please check your email!' };
});
const adminForgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        email = email.toLowerCase();
    }
    const user = yield prisma_1.default.user.findFirst({
        where: { email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role !== client_1.Role.ADMIN &&
        user.role !== client_1.Role.EMPLOYEE &&
        user.role !== client_1.Role.MANAGER &&
        user.role !== client_1.Role.SUPER_ADMIN) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not a valid user!');
    }
    // Generate new password
    const password = (0, otpService_1.generatePassword)();
    yield (0, sendEmail_1.sendEmail)(email, 'Your Password Reset', (0, resettemplate_1.resetTemplate)(password));
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
        },
    });
    return { message: 'Please check your email!' };
});
const changePassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, currentPassword, password } = payload;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
    }
    const isPasswordMatched = (givenPassword, savedPassword) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
    if (isUserExist.password &&
        !(yield isPasswordMatched(currentPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Current Password is incorrect');
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma_1.default.user.update({
        where: {
            id: isUserExist.id,
        },
        data: {
            password: hashedPassword,
        },
    });
});
const setPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, password } = payload;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma_1.default.user.update({
        where: {
            id: isUserExist.id,
        },
        data: {
            password: hashedPassword,
            setPassword: false,
        },
    });
});
const mailTest = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sendEmail_1.sendEmail)('f4faysals@gmail.com', 'Password Reset', `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
        <h1 style="color: #ff6f61;">Welcome to Our Team, Faysal Hossain!</h1>
        <p style="color: #555;">We are thrilled to have you on board. Your account has been created successfully.</p>
        <div style="margin-top: 20px; background-color: #ffe6e6; padding: 15px; border-radius: 8px;">
          <p style="font-weight: bold;">Your temporary password is:</p>
          <p style="color: #ff6f61; font-size: 18px;">12345678</p>
        </div>
        <p style="color: #555;">Please use this password to login to your account and make sure to change it after your first login for security purposes.</p>
        <p style="margin-top: 20px;">Thank you,</p>
        <p style="font-weight: bold; color: #ff6f61;">The Team</p>
      </div>
    </div>
  `);
    return { message: 'Mail sent successfully!' };
});
exports.AuthService = {
    mailTest,
    registerAdmin,
    adminLogin,
    forgotPassword,
    login,
    register,
    changePassword,
    checkoutLogin,
    adminForgotPassword,
    setPassword,
};
