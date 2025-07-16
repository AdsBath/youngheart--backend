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
exports.CartService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data, productId, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { sessionId } });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
    }
    let cart = yield prisma_1.default.cart.findFirst({ where: { userId: user.id } });
    if (!cart) {
        cart = yield prisma_1.default.cart.create({
            data: { userId: user.id, sessionId },
        });
    }
    let cartItem = yield prisma_1.default.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId,
        },
    });
    if (cartItem) {
        cartItem = yield prisma_1.default.cartItem.update({
            where: { id: cartItem.id },
            data: {
                quantity: cartItem.quantity + 1,
            },
        });
    }
    else {
        cartItem = yield prisma_1.default.cartItem.create({
            data: {
                quantity: data.quantity,
                cartId: cart.id,
                color: data.color,
                size: data.size,
                price: data.price,
                productId,
                discount: data.discount,
                discountAmmount: data.discountAmmount,
                image: data.image,
                name: data.name,
            },
        });
    }
    return cartItem;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cart.findMany({
        orderBy: { id: 'desc' },
        include: {
            cartItems: true,
            user: true,
        },
    });
    const total = yield prisma_1.default.cart.count({});
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cart.findFirst({
        where: {
            userId: id,
        },
        include: {
            user: true,
            cartItems: {
                include: {
                    product: {
                        include: {
                            shippingRules: true,
                        },
                    },
                },
            },
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cart.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cart.delete({
        where: {
            id,
        },
    });
    return result;
});
const incrementQuantity = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = data;
    const cart = yield prisma_1.default.cart.findFirst({
        where: {
            userId,
        },
    });
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Shopping cart not created yet!');
    }
    const cartItem = yield prisma_1.default.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId,
        },
    });
    if (cartItem) {
        // const updatedQuantity = cartItem.quantity + 1;
        const updateResult = yield prisma_1.default.cartItem.update({
            where: { id: cartItem.id },
            data: {
                quantity: {
                    increment: 1,
                },
            },
        });
        return updateResult;
    }
    throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cart item not found!');
});
const decrementQuantity = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = data;
    const cart = yield prisma_1.default.cart.findFirst({
        where: {
            userId,
        },
    });
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Shopping cart not created yet!');
    }
    const cartItem = yield prisma_1.default.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId,
        },
    });
    if (cartItem && cartItem.quantity > 1) {
        const updateResult = yield prisma_1.default.cartItem.update({
            where: { id: cartItem.id },
            data: {
                quantity: {
                    decrement: 1,
                },
            },
        });
        return updateResult;
    }
    if (cartItem && cartItem.quantity === 1) {
        yield prisma_1.default.cartItem.delete({
            where: { id: cartItem.id },
        });
        return null;
    }
    throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cart item not found!');
});
const deleteCartItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cartItem.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.CartService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    incrementQuantity,
    decrementQuantity,
    deleteCartItem,
};
