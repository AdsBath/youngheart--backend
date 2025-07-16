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
exports.CouponService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.create({
        data,
    });
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.findMany({
        orderBy: { id: 'desc' },
    });
    const total = yield prisma_1.default.coupon.count({});
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.delete({
        where: {
            id,
        },
    });
    return result;
});
const applyCoupon = (totalPrice, couponCode, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the coupon details
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: { code: couponCode },
    });
    if (!coupon) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid coupon code');
    }
    // Check coupon validity
    const currentDate = new Date();
    if (currentDate < coupon.startTime || currentDate > coupon.endTime) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon is not valid at this time');
    }
    if (coupon.timesUsed >= coupon.usageLimit) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon usage limit has been reached');
    }
    // Check if the coupon has already been applied to the order
    const isCouponAlreadyApplied = yield prisma_1.default.userCoupon.findMany({
        where: {
            userId,
            couponId: coupon.id,
        },
    });
    if (isCouponAlreadyApplied.length === coupon.limitPerUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon has already been applied to this order');
    }
    // Check if minimum spend requirement is met
    if (totalPrice < coupon.minSpent) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Minimum spend of ${coupon.minSpent} is required to apply this coupon`);
    }
    // Calculate discount based on priceType
    let discount = 0;
    if (coupon.priceType === 'percentage') {
        discount = (totalPrice * coupon.price) / 100;
    }
    else if (coupon.priceType === 'fixed') {
        discount = coupon.price;
    }
    // Apply capped price if applicable
    if (coupon.cappedPrice && discount > coupon.cappedPrice) {
        discount = coupon.cappedPrice;
    }
    // Update the order total price after applying the discount
    // const updatedTotalPrice = order.totalPrice - discount;
    // Create an OrderCoupon entry to track the applied coupon
    // await prisma.orderCoupon.create({
    //   data: {
    //     orderId: order.id,
    //     couponId: coupon.id,
    //   },
    // });
    // Update the order total price and increment coupon usage count
    // await prisma.order.update({
    //   where: { id: order.id },
    //   data: {
    //     totalPrice: updatedTotalPrice,
    //   },
    // });
    // await prisma.coupon.update({
    //   where: { id: coupon.id },
    //   data: {
    //     timesUsed: coupon.timesUsed + 1,
    //   },
    // });
    return {
        discount,
        coupon,
    };
});
const deleteMultipleData = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.deleteMany({
        where: {
            id: { in: ids },
        },
    });
    return result;
});
exports.CouponService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    applyCoupon,
    deleteMultipleData,
};
