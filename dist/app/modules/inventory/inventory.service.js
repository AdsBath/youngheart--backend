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
exports.InventoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.inventory.create({
        data,
    });
    return result;
});
const getAllFromDB = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(paginationOptions)
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const result = yield prisma_1.default.inventory.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            product: true,
            inventoryNotes: true,
        },
        take: limit,
        skip: skip,
    });
    const total = yield prisma_1.default.inventory.count();
    return {
        page,
        total,
        data: result,
    };
});
const getDataByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.inventory.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Inventory not found!');
    }
    return result;
});
const updateByIdFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const inventory = yield prisma_1.default.inventory.findUnique({
        where: {
            id,
        },
    });
    if (!inventory) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Inventory not found!');
    }
    const result = yield prisma_1.default.inventory.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const inventory = yield prisma_1.default.inventory.findUnique({
        where: {
            id,
        },
    });
    if (!inventory) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Inventory not found!');
    }
    const result = yield prisma_1.default.inventory.delete({
        where: {
            id: inventory.id,
        },
        include: {
            product: true,
        },
    });
    return result;
});
const createInventoryNote = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.inventoryNote.create({
        data,
    });
    return result;
});
const getInventoryNoteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.inventoryNote.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Inventory note not found!');
    }
    return result;
});
const updateInventoryNote = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const inventory = yield prisma_1.default.inventoryNote.findUnique({
        where: {
            id,
        },
    });
    if (!inventory) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Inventory Note not found!');
    }
    const result = yield prisma_1.default.inventoryNote.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
exports.InventoryService = {
    getAllFromDB,
    insertIntoDb,
    deleteByIdFromDB,
    getDataByIdFromDB,
    updateByIdFromDB,
    createInventoryNote,
    updateInventoryNote,
    getInventoryNoteById,
};
