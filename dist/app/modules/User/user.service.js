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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.sessionId) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'SessionId is required!');
    }
    const result = yield prisma_1.default.user.create({ data });
    return result;
});
// admin all
const allAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    // Role.ADMIN || Role.EMPLOYEE || Role.MANAGER
    const result = yield prisma_1.default.user.findMany({
        where: {
            OR: [
                { role: 'ADMIN' },
                { role: 'EMPLOYEE' },
                { role: 'MANAGER' },
                { role: 'SUPER_ADMIN' },
            ],
        },
    });
    return result;
});
// admin me
const adminProfile = (authToken, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jwtHelpers_1.jwtHelpers.verifyToken(authToken, config_1.default.jwt.secret);
    const { userId, role } = decoded;
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
            role,
            sessionId,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin not found');
    }
    return result;
});
const getAllData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany();
    const total = yield prisma_1.default.user.count();
    return { total, data: result };
});
const getMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            sessionId: id,
        },
        select: {
            id: true,
            phone: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            image: true,
            role: true,
            isUser: true,
            sessionId: true,
            loginCount: true,
            lastLogin: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            orders: true,
        },
    });
    return result;
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload === null || payload === void 0 ? void 0 : payload.email) {
        payload.email = payload.email.toLowerCase();
        const isExist = yield prisma_1.default.user.findFirst({
            where: {
                email: payload.email,
            },
        });
        if (isExist) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Email already exists!');
        }
    }
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const result = yield prisma_1.default.user.delete({
        where: {
            id: user.id,
        },
    });
    return result;
});
const getUserBySessionId = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!sessionId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'SessionId is required!');
    }
    const result = yield prisma_1.default.user.findUnique({ where: { sessionId } });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found!');
    }
    return result;
});
const deleteAllAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin not found!');
    }
    const result = yield prisma_1.default.user.delete({
        where: {
            id: user.id,
        },
    });
    return result;
});
const getAdminById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const deleteMultipleRegisterData = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.deleteMany({
        where: {
            role: 'USER',
            id: { in: ids },
        },
    });
    return result;
});
const deleteMultipleGuestData = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.deleteMany({
        where: {
            role: 'GUEST',
            id: { in: ids },
        },
    });
    return result;
});
exports.UserService = {
    insertIntoDb,
    getAllData,
    deleteUser,
    updateUser,
    getUserBySessionId,
    getUserById,
    getMe,
    allAdmin,
    deleteAllAdmin,
    adminProfile,
    getAdminById,
    deleteMultipleRegisterData,
    deleteMultipleGuestData,
};
