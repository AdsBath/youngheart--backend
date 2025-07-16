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
exports.BundleDiscountService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateSlug_1 = __importDefault(require("../../../utils/generateSlug"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, generateSlug_1.default)(data.name);
    const existingBundleDiscount = yield prisma_1.default.bundleDiscount.findUnique({
        where: {
            slug,
        },
    });
    if (existingBundleDiscount) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already have a name in the bundle');
    }
    data.slug = slug;
    const result = yield prisma_1.default.bundleDiscount.create({
        data,
    });
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bundleDiscount.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    const total = yield prisma_1.default.bundleDiscount.count();
    return {
        total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bundleDiscount.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, generateSlug_1.default)(data.name);
    data.slug = slug;
    const result = yield prisma_1.default.bundleDiscount.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bundleDiscount.delete({
        where: {
            id,
        },
    });
    return result;
});
const deleteMultipleData = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bundleDiscount.deleteMany({
        where: {
            id: { in: ids },
        },
    });
    return result;
});
exports.BundleDiscountService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    deleteMultipleData,
};
