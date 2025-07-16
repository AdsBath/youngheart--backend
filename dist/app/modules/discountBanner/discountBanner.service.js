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
exports.DiscountBannerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateSlug_1 = __importDefault(require("../../../utils/generateSlug"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, generateSlug_1.default)(data.name);
    const existingDiscountBanner = yield prisma_1.default.discountBanner.findUnique({
        where: {
            slug,
        },
    });
    if (existingDiscountBanner) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already have a name in the discount banner');
    }
    data.slug = slug;
    const result = yield prisma_1.default.discountBanner.create({
        data,
    });
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.discountBanner.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    const total = yield prisma_1.default.discountBanner.count();
    return {
        total,
        data: result,
    };
});
const getDiscountBanner = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.discountBanner.findFirst({
        where: {
            status: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Discount Banner not found');
    }
    return result;
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.discountBanner.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, generateSlug_1.default)(data.name);
    data.slug = slug;
    const result = yield prisma_1.default.discountBanner.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.discountBanner.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.DiscountBannerService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    getDiscountBanner,
};
