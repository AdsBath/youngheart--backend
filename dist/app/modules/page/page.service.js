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
exports.PageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDisplayOrder = yield prisma_1.default.page.findFirst({
        where: {
            displayOrder: data === null || data === void 0 ? void 0 : data.displayOrder,
        },
    });
    if (existingDisplayOrder) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already this display order Added!');
    }
    const result = yield prisma_1.default.page.create({
        data: Object.assign({}, data),
    });
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.page.findMany({
        orderBy: { displayOrder: 'asc' },
    });
    const total = yield prisma_1.default.page.count({});
    return {
        total: total,
        data: result,
    };
});
const getAllForFrontend = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.page.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            displayOrder: 'asc',
        },
    });
    const total = yield prisma_1.default.page.count({
        where: {
            isActive: true,
        },
    });
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.page.findFirst({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.page.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.page.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.PageService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    getAllForFrontend,
};
