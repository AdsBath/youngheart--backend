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
exports.OrderService = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const http_status_1 = __importDefault(require("http-status"));
const months_1 = require("../../../constants/months");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const generateOrderId_1 = require("../../../shared/generateOrderId");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendEmail_1 = require("../../../shared/sendEmail");
const emailtemplate_1 = require("../../../utils/emailtemplate");
const notificationEmitter_1 = __importDefault(require("../../events/notificationEmitter"));
const SSLCommerzPayment = require('sslcommerz-lts');
const store_id = 'mrsop668b9b841325b';
const store_passwd = 'mrsop668b9b841325b@ssl';
const is_live = false; //true for live, false for sandbox
// update product variation & stock
const updateProductAndVariations = (orderItems, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(orderItems, 'for update function orderItems');
    for (const item of orderItems) {
        const { productId, quantity, color, size } = item;
        // Fetch the current product details
        const product = yield prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (product) {
            const variations = product.variations;
            // Find the corresponding variation
            const variationIndex = variations.findIndex((variation) => variation.color === color && variation.size === size);
            if (variationIndex > -1) {
                // Update the quantity for the specific variation
                variations[variationIndex].quantity = (parseInt(variations[variationIndex].quantity) - quantity).toString();
                // Update the product with new variations and stock
                yield prisma.product.update({
                    where: {
                        id: productId,
                    },
                    data: {
                        variations: variations, // No need to stringify if it's already an array/object
                        stock: (parseInt(product.stock) - quantity).toString(), // Update the overall product stock
                    },
                });
            }
        }
    }
});
// Complete code with context
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = (0, generateOrderId_1.generateOrderId)(10);
    payload.orderId = orderId;
    const { products, couponId = null, email, firstName, lastName } = payload, others = __rest(payload, ["products", "couponId", "email", "firstName", "lastName"]);
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const initialOrder = yield prisma.order.create({
            data: Object.assign(Object.assign({}, others), { status: 'PENDING', orderId }),
        });
        yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.orderItem.create({
                data: {
                    quantity: product.quantity,
                    color: product.color,
                    size: product.size,
                    price: product.price,
                    orderId: initialOrder.id,
                    productId: product.productId,
                    productImage: product.image,
                    discount: product.discount,
                    discountAmmount: product.discountAmmount,
                    productName: product.product.name,
                    productSku: product.product.sku,
                },
            });
        })));
        if (couponId) {
            const coupon = yield prisma.coupon.findUnique({
                where: {
                    id: couponId,
                },
            });
            if (coupon && initialOrder && initialOrder.id) {
                // create order coupon
                yield prisma.orderCoupon.create({
                    data: {
                        orderId: initialOrder === null || initialOrder === void 0 ? void 0 : initialOrder.id,
                        couponId: coupon.id,
                    },
                });
                // create user coupon
                yield prisma.userCoupon.create({
                    data: {
                        userId: payload.userId,
                        couponId: coupon.id,
                    },
                });
                // update coupon
                yield prisma.coupon.update({
                    where: { id: coupon.id },
                    data: {
                        timesUsed: coupon.timesUsed + 1,
                    },
                });
            }
        }
        if (!initialOrder) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Order failed');
        }
        notificationEmitter_1.default.emit('orderCreated', initialOrder);
        // Create and save notification
        yield prisma.orderNotification.create({
            data: {
                userId: initialOrder.userId,
                orderId: initialOrder.id,
                message: `Your order #${initialOrder.id} has been created!`,
            },
        });
        if ((payload === null || payload === void 0 ? void 0 : payload.paymentMethod) === 'online') {
            const data = {
                total_amount: payload === null || payload === void 0 ? void 0 : payload.totalAmount,
                currency: 'BDT',
                tran_id: orderId, // use unique tran_id for each api call
                success_url: `http://localhost:3000/checkout/order-receive/${orderId}`,
                fail_url: `http://localhost:3000/checkout/payment-fail`,
                cancel_url: `http://localhost:3000/checkout/payment-cancel`,
                ipn_url: 'http://localhost:3000/ipn',
                shipping_method: payload === null || payload === void 0 ? void 0 : payload.paymentMethod,
                product_name: 'Default.',
                product_Order: 'Default',
                product_category: 'Default',
                product_profile: 'Default',
                cus_name: 'Masud Rana',
                cus_email: 'masud@gmail.com',
                cus_add1: 'Natore',
                cus_city: 'Lalpur',
                cus_postcode: '1207',
                cus_country: 'Bangladesh',
                cus_phone: '+8801796682951',
                ship_name: 'Default',
                ship_add1: 'Natore',
                ship_city: 'Lalpur',
                ship_postcode: '1207',
                ship_country: 'Bangladesh',
            };
            const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
            const apiResponse = yield sslcz.init(data);
            // console.log(apiResponse);
            if (apiResponse.status === 'SUCCESS') {
                const gatewayPageURL = apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.GatewayPageURL;
                yield handlePaymentSuccess(payload.userId, products, prisma);
                yield updateProductAndVariations(products, prisma);
                return { gatewayPageURL };
            }
            else {
                throw new ApiError_1.default(400, 'Order confirm failed!');
            }
        }
        else {
            yield handlePaymentSuccess(payload.userId, products, prisma);
            yield updateProductAndVariations(products, prisma);
            // Emit orderCreated event
            // const user = await prisma.user.findUnique({
            //   where: {
            //     id: payload?.userId,
            //   },
            // });
            // Send order summary email after successful order
            const emailSubject = 'Thank You for Your Order!';
            const getOrder = yield prisma.order.findUnique({
                where: {
                    id: initialOrder.id,
                },
                include: {
                    user: true,
                    orderItems: {
                        include: {
                            product: {
                                include: {
                                    bundleDiscount: true,
                                },
                            },
                        },
                    },
                },
            });
            if (initialOrder) {
                yield (0, sendEmail_1.sendEmail)(email, emailSubject, (0, emailtemplate_1.emailTemplate)(getOrder, getOrder, firstName, lastName));
            }
            return initialOrder;
        }
    }));
});
// clear cart items after order
const handlePaymentSuccess = (userId, products, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield prisma.cart.findFirst({
        where: {
            userId: userId,
        },
    });
    if (!cart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'cart not found!');
    }
    const conditions = products.map((product) => ({
        cartId: cart.id,
        productId: product.productId,
    }));
    yield prisma.cartItem.deleteMany({
        where: {
            OR: conditions,
        },
    });
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            orderCoupons: {
                include: {
                    coupon: true,
                },
            },
            orderBundles: true,
            user: true,
        },
    });
    const total = yield prisma_1.default.order.count({});
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUnique({
        where: {
            id,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            user: true,
            orderBundles: true,
            orderCoupons: true,
        },
    });
    return result;
});
const getOrderByOrderId = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findFirst({
        where: {
            orderId,
        },
    });
    return result;
});
const getMyOrderByIdFromDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findFirst({
        where: {
            orderId,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            user: true,
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const orderCancelUpdateProductAndVariations = (orderItems, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(orderItems, 'for update function orderItems');
    for (const item of orderItems) {
        const { productId, quantity, color, size } = item;
        // Fetch the current product details
        const product = yield prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (product) {
            // Work with the JSON variations directly
            const variations = product.variations; // Assuming product.variations is already an array
            // Find the corresponding variation
            const variationIndex = variations.findIndex((variation) => variation.color === color && variation.size === size);
            if (variationIndex > -1) {
                // Update the quantity for the specific variation
                variations[variationIndex].quantity = (parseInt(variations[variationIndex].quantity) + quantity).toString();
                // Update the product with new variations and stock
                yield prisma.product.update({
                    where: {
                        id: productId,
                    },
                    data: {
                        variations: variations, // No need to stringify if it's already an array/object
                        stock: (parseInt(product.stock) + quantity).toString(), // Update the overall product stock
                    },
                });
            }
        }
    }
});
const allowedTransitions = {
    [client_1.OrderStatus.PENDING]: [client_1.OrderStatus.CONFIRMED, client_1.OrderStatus.CANCELED],
    [client_1.OrderStatus.CONFIRMED]: [client_1.OrderStatus.PACKING, client_1.OrderStatus.CANCELED],
    [client_1.OrderStatus.PACKING]: [client_1.OrderStatus.DELIVERED, client_1.OrderStatus.EXCHANGE],
    [client_1.OrderStatus.DELIVERED]: [client_1.OrderStatus.EXCHANGE],
    [client_1.OrderStatus.CANCELED]: [],
    [client_1.OrderStatus.EXCHANGE]: [],
};
const updateOrderStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findOrder = yield prisma_1.default.order.findUnique({
        where: {
            id,
        },
        include: {
            orderItems: true,
        },
    });
    if (!findOrder) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Order not found!');
    }
    const currentStatus = findOrder.status;
    // Validate the status transition
    const validNextStatuses = allowedTransitions[currentStatus];
    if (!validNextStatuses.includes(payload.status)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Invalid status transition from ${currentStatus} to ${payload.status}!`);
    }
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        if (payload.status === client_1.OrderStatus.CANCELED) {
            const updateOrderStatus = yield prisma.order.update({
                where: {
                    id: findOrder.id,
                },
                data: {
                    status: payload.status,
                },
            });
            yield orderCancelUpdateProductAndVariations(findOrder.orderItems, prisma);
            return updateOrderStatus;
        }
        else {
            const updateOrderStatus = yield prisma.order.update({
                where: {
                    id: findOrder.id,
                },
                data: {
                    status: payload.status,
                },
            });
            return updateOrderStatus;
        }
    }));
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.delete({
        where: {
            id,
        },
    });
    return result;
});
const getMyOrder = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            sessionId,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found!');
    }
    const myOrder = yield prisma_1.default.order.findMany({
        where: {
            userId: user.id,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });
    return myOrder;
});
const oderOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalProduct = yield prisma_1.default.product.count({});
    const total = yield prisma_1.default.order.count({});
    const now = new Date();
    const todayTotal = yield prisma_1.default.order.count({
        where: {
            createdAt: { gte: (0, date_fns_1.startOfDay)(now), lt: (0, date_fns_1.endOfDay)(now) },
        },
    });
    // Fetch all orders
    const orders = yield prisma_1.default.order.findMany({
        select: {
            totalAmount: true,
            shippingCharge: true,
            createdAt: true,
        },
    });
    const todayOrders = yield prisma_1.default.order.findMany({
        where: {
            createdAt: { gte: (0, date_fns_1.startOfDay)(now), lt: (0, date_fns_1.endOfDay)(now) },
        },
        select: {
            totalAmount: true,
            shippingCharge: true,
            createdAt: true,
        },
    });
    const recentOrders = yield prisma_1.default.order.findMany({
        where: {
            status: client_1.OrderStatus.PENDING,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10,
        skip: 0,
    });
    // Calculate the total amount excluding the shipping charge
    const todayAmount = todayOrders.reduce((acc, order) => {
        return acc + order.totalAmount;
    }, 0);
    const totalAmount = orders.reduce((acc, order) => {
        return acc + order.totalAmount;
    }, 0);
    // Initialize the monthly data with all months
    const monthlyData = months_1.monthNames.reduce((acc, month) => {
        acc[month] = { order: 0, revenue: 0 };
        return acc;
    }, {});
    // Aggregate data by month
    orders.forEach(order => {
        const month = order.createdAt.toLocaleString('default', {
            month: 'long',
        });
        monthlyData[month].order += 1;
        monthlyData[month].revenue += order.totalAmount;
    });
    // Convert the aggregated data to the desired format
    const chartData = months_1.monthNames.map(month => ({
        month,
        order: monthlyData[month].order,
        revenue: monthlyData[month].revenue,
    }));
    return {
        total,
        todayTotal,
        totalAmount,
        todayAmount,
        chartData,
        recentOrders,
        totalProduct,
    };
});
const orderAnalytics = (selectedValue) => __awaiter(void 0, void 0, void 0, function* () {
    let dateFilter = {};
    const now = new Date();
    switch (selectedValue) {
        case 'today':
            dateFilter = { gte: (0, date_fns_1.startOfDay)(now), lt: (0, date_fns_1.endOfDay)(now) }; // All of today
            break;
        case 'last_week':
            dateFilter = { gte: (0, date_fns_1.startOfDay)((0, date_fns_1.subWeeks)(now, 1)), lt: (0, date_fns_1.startOfDay)(now) }; // From the start of last week to the start of today
            break;
        case 'last_month':
            dateFilter = { gte: (0, date_fns_1.startOfDay)((0, date_fns_1.subMonths)(now, 1)), lt: (0, date_fns_1.startOfDay)(now) }; // From the start of last month to the start of today
            break;
        case 'last_year':
            dateFilter = { gte: (0, date_fns_1.startOfDay)((0, date_fns_1.subYears)(now, 1)), lt: (0, date_fns_1.startOfDay)(now) }; // From the start of last year to the start of today
            break;
        case 'all':
        default:
            dateFilter = {}; // No date filter for 'all'
            break;
    }
    const whereClause = selectedValue === 'all' ? {} : { createdAt: dateFilter };
    // Run queries in parallel
    const [orderCancelled, orderPending, orderConfirmed, orderPacking, orderDelivered, orderExchange,] = yield Promise.all([
        prisma_1.default.order.count({
            where: Object.assign({ status: client_1.OrderStatus.CANCELED }, whereClause),
        }),
        prisma_1.default.order.count({
            where: Object.assign({ status: client_1.OrderStatus.PENDING }, whereClause),
        }),
        prisma_1.default.order.count({
            where: Object.assign({ status: client_1.OrderStatus.CONFIRMED }, whereClause),
        }),
        prisma_1.default.order.count({
            where: Object.assign({ status: client_1.OrderStatus.PACKING }, whereClause),
        }),
        prisma_1.default.order.count({
            where: Object.assign({ status: client_1.OrderStatus.DELIVERED }, whereClause),
        }),
        prisma_1.default.order.count({
            where: Object.assign({ status: client_1.OrderStatus.EXCHANGE }, whereClause),
        }),
    ]);
    // console.log(`Execution time: ${endTime - startTime} milliseconds`);
    return {
        orderCancelled,
        orderPending,
        orderConfirmed,
        orderPacking,
        orderDelivered,
        orderExchange,
    };
});
const getDailyDataForMonth = (year, month) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the total number of days in the month
    const daysInMonth = new Date(year, month, 0).getDate();
    // Fetch all orders within the specified month and year
    const orders = yield prisma_1.default.order.findMany({
        where: {
            createdAt: {
                gte: new Date(year, month - 1, 1), // Start of the month
                lt: new Date(year, month, 1), // Start of the next month
            },
        },
        select: {
            totalAmount: true,
            shippingCharge: true,
            createdAt: true,
        },
    });
    // Initialize an empty object to aggregate daily data
    const dailyData = {};
    // Aggregate data by day
    orders.forEach(order => {
        const date = order.createdAt.toISOString().split('T')[0]; // Get the date in 'YYYY-MM-DD' format
        if (!dailyData[date]) {
            dailyData[date] = { sale: 0, revenue: 0 };
        }
        dailyData[date].sale += 1;
        dailyData[date].revenue += order.totalAmount;
    });
    // Generate the full list of dates for the month and fill with data
    const chartData = Array.from({ length: daysInMonth }, (_, day) => {
        var _a, _b;
        const date = new Date(year, month - 1, day + 1)
            .toISOString()
            .split('T')[0];
        return {
            date,
            sale: ((_a = dailyData[date]) === null || _a === void 0 ? void 0 : _a.sale) || 0,
            revenue: ((_b = dailyData[date]) === null || _b === void 0 ? void 0 : _b.revenue) || 0,
        };
    });
    return {
        chartData,
    };
});
const getTopTenProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const topProducts = yield prisma_1.default.orderItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true,
            price: true, // Summing up the price to calculate total revenue
        },
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
        take: 10,
    });
    const productIds = topProducts.map(item => item.productId);
    const products = yield prisma_1.default.product.findMany({
        where: { id: { in: productIds } },
    });
    return products.map(product => {
        const matchedProduct = topProducts.find(item => item.productId === product.id);
        return Object.assign(Object.assign({}, product), { totalQuantitySold: (matchedProduct === null || matchedProduct === void 0 ? void 0 : matchedProduct._sum.quantity) || 0, totalRevenue: (matchedProduct === null || matchedProduct === void 0 ? void 0 : matchedProduct._sum.price) || 0 });
    });
});
const getTopTenCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const productQuantities = yield prisma_1.default.orderItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true,
            price: true, // Summing up the price to calculate total revenue
        },
    });
    const categoryCount = {};
    for (const item of productQuantities) {
        const product = yield prisma_1.default.product.findUnique({
            where: { id: item.productId },
            select: { categoryId: true },
        });
        if (product === null || product === void 0 ? void 0 : product.categoryId) {
            if (!categoryCount[product.categoryId]) {
                categoryCount[product.categoryId] = {
                    totalQuantity: 0,
                    totalRevenue: 0,
                };
            }
            categoryCount[product.categoryId].totalQuantity +=
                item._sum.quantity || 0;
            categoryCount[product.categoryId].totalRevenue += item._sum.price || 0;
        }
    }
    const sortedCategories = Object.entries(categoryCount)
        .sort(([, a], [, b]) => b.totalQuantity - a.totalQuantity)
        .slice(0, 10);
    const categoryIds = sortedCategories.map(([categoryId]) => categoryId);
    const categories = yield prisma_1.default.category.findMany({
        where: { id: { in: categoryIds } },
    });
    return categories.map((category) => {
        const matchedCategory = categoryCount[category.id];
        return Object.assign(Object.assign({}, category), { totalQuantitySold: (matchedCategory === null || matchedCategory === void 0 ? void 0 : matchedCategory.totalQuantity) || 0, totalRevenue: (matchedCategory === null || matchedCategory === void 0 ? void 0 : matchedCategory.totalRevenue) || 0 });
    });
});
const deleteMultipleData = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.deleteMany({
        where: {
            id: { in: ids },
        },
    });
    return result;
});
exports.OrderService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    getMyOrderByIdFromDB,
    getOrderByOrderId,
    updateOrderStatus,
    getMyOrder,
    oderOverview,
    orderAnalytics,
    getDailyDataForMonth,
    getTopTenCategories,
    getTopTenProducts,
    deleteMultipleData,
};
