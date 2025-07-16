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
exports.WishlistService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingWishlist = yield prisma_1.default.wishlist.findFirst({
        where: {
            userId: data.userId,
            productId: data.productId,
        },
    });
    let result;
    if (existingWishlist) {
        result = yield prisma_1.default.wishlist.delete({
            where: {
                id: existingWishlist.id,
            },
        });
    }
    else {
        result = yield prisma_1.default.wishlist.create({
            data,
        });
    }
    return result;
});
const getMyWishlistFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wishlist.findMany({
        where: {
            userId,
        },
        include: {
            product: true,
        },
        orderBy: { id: 'desc' },
    });
    const total = yield prisma_1.default.wishlist.count({});
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wishlist.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wishlist.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingWishlist = yield prisma_1.default.wishlist.findUnique({
        where: {
            id,
        },
    });
    if (!existingWishlist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Wishlist not found!');
    }
    const result = yield prisma_1.default.wishlist.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.WishlistService = {
    insertIntoDB,
    getMyWishlistFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
