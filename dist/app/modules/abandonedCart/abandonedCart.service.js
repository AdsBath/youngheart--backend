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
exports.AbandonCartService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { products } = data, others = __rest(data, ["products"]);
    const existingAbandonedCart = yield prisma_1.default.abandonedCart.findFirst({
        where: {
            userId: data === null || data === void 0 ? void 0 : data.userId,
        },
    });
    let abandonedCart;
    if (existingAbandonedCart) {
        // Update the existing abandoned cart
        abandonedCart = yield prisma_1.default.abandonedCart.update({
            where: {
                id: existingAbandonedCart.id,
            },
            data: others,
        });
        if (abandonedCart) {
            // Delete existing items
            yield prisma_1.default.abandonedCartItem.deleteMany({
                where: {
                    abandonedCartId: abandonedCart.id,
                },
            });
            // Create new items
            yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma_1.default.abandonedCartItem.create({
                    data: {
                        productId: product === null || product === void 0 ? void 0 : product.productId,
                        quantity: product.quantity,
                        color: product.color,
                        size: product.size,
                        price: product.price,
                        abandonedCartId: abandonedCart.id,
                    },
                });
            })));
        }
    }
    else {
        // Create a new abandoned cart
        abandonedCart = yield prisma_1.default.abandonedCart.create({
            data: others,
        });
        if (abandonedCart) {
            // Create new items
            yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma_1.default.abandonedCartItem.create({
                    data: {
                        productId: product === null || product === void 0 ? void 0 : product.productId,
                        quantity: product.quantity,
                        color: product.color,
                        size: product.size,
                        abandonedCartId: abandonedCart.id,
                    },
                });
            })));
        }
    }
    return abandonedCart;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.abandonedCart.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            abandonedCartItems: {
                include: {
                    product: true,
                },
            },
            user: true,
        },
    });
    const total = yield prisma_1.default.abandonedCart.count({});
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.abandonedCart.findFirst({
        where: {
            userId: id,
        },
        include: {
            abandonedCartItems: true,
        },
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const abandonCart = yield prisma_1.default.abandonedCart.findUnique({
        where: {
            id,
        },
    });
    if (!abandonCart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Abandoned Cart not found');
    }
    yield prisma_1.default.abandonedCartItem.deleteMany({
        where: {
            abandonedCartId: abandonCart.id,
        },
    });
    const result = yield prisma_1.default.abandonedCart.delete({
        where: {
            id,
        },
    });
    return result;
});
const deleteCartItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.abandonedCartItem.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.AbandonCartService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteByIdFromDB,
    deleteCartItem,
};
