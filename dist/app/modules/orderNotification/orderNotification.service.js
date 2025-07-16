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
exports.OrderNotificationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orderNotification.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            order: true,
            user: true,
        },
    });
    return result;
});
const getUserNotification = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orderNotification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return result;
});
const markAsRead = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orderNotification.findMany({
        where: {
            read: false,
        },
    });
    if (!result || result.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No unread notifications found');
    }
    const notificationIds = result.map(notification => notification.id);
    const notifications = yield prisma_1.default.orderNotification.updateMany({
        where: {
            id: { in: notificationIds },
        },
        data: { read: true },
    });
    return notifications;
});
exports.OrderNotificationService = {
    getUserNotification,
    getAllNotifications,
    markAsRead,
};
