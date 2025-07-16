/* eslint-disable @typescript-eslint/no-var-requires */
import { Order, OrderStatus } from '@prisma/client';
import { endOfDay, startOfDay, subMonths, subWeeks, subYears } from 'date-fns';
import httpStatus from 'http-status';
import { monthNames } from '../../../constants/months';
import ApiError from '../../../errors/ApiError';
import { ChartData } from '../../../interfaces/common';
import { generateOrderId } from '../../../shared/generateOrderId';
import prisma from '../../../shared/prisma';
import { sendEmail } from '../../../shared/sendEmail';
import { emailTemplate } from '../../../utils/emailtemplate';
import notificationEmitter from '../../events/notificationEmitter';
import { IOrder } from './order.interface';
const SSLCommerzPayment = require('sslcommerz-lts');
const store_id = 'mrsop668b9b841325b';
const store_passwd = 'mrsop668b9b841325b@ssl';
const is_live = false; //true for live, false for sandbox

// update product variation & stock
const updateProductAndVariations = async (orderItems: any[], prisma: any) => {
  // console.log(orderItems, 'for update function orderItems');
  for (const item of orderItems) {
    const { productId, quantity, color, size } = item;

    // Fetch the current product details
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (product) {
      const variations = product.variations;

      // Find the corresponding variation
      const variationIndex = variations.findIndex(
        (variation: any) =>
          variation.color === color && variation.size === size,
      );

      if (variationIndex > -1) {
        // Update the quantity for the specific variation
        variations[variationIndex].quantity = (
          parseInt(variations[variationIndex].quantity) - quantity
        ).toString();

        // Update the product with new variations and stock
        await prisma.product.update({
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
};

// Complete code with context
const insertIntoDB = async (payload: any): Promise<any> => {
  const orderId = generateOrderId(10);
  payload.orderId = orderId;
  const {
    products,
    couponId = null,
    email,
    firstName,
    lastName,
    ...others
  } = payload;

  return await prisma.$transaction(async prisma => {
    const initialOrder = await prisma.order.create({
      data: {
        ...others,
        status: 'PENDING',
        orderId,
      },
    });

    await Promise.all(
      products.map(async (product: any) => {
        await prisma.orderItem.create({
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
      }),
    );

    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: {
          id: couponId,
        },
      });

      if (coupon && initialOrder && initialOrder.id) {
        // create order coupon
        await prisma.orderCoupon.create({
          data: {
            orderId: initialOrder?.id,
            couponId: coupon.id,
          },
        });

        // create user coupon
        await prisma.userCoupon.create({
          data: {
            userId: payload.userId,
            couponId: coupon.id,
          },
        });

        // update coupon
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: {
            timesUsed: coupon.timesUsed + 1,
          },
        });
      }
    }

    if (!initialOrder) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Order failed');
    }

    notificationEmitter.emit('orderCreated', initialOrder);

    // Create and save notification
    await prisma.orderNotification.create({
      data: {
        userId: initialOrder.userId,
        orderId: initialOrder.id,
        message: `Your order #${initialOrder.id} has been created!`,
      },
    });

    if (payload?.paymentMethod === 'online') {
      const data = {
        total_amount: payload?.totalAmount,
        currency: 'BDT',
        tran_id: orderId, // use unique tran_id for each api call
        success_url: `http://localhost:3000/checkout/order-receive/${orderId}`,
        fail_url: `http://localhost:3000/checkout/payment-fail`,
        cancel_url: `http://localhost:3000/checkout/payment-cancel`,
        ipn_url: 'http://localhost:3000/ipn',
        shipping_method: payload?.paymentMethod,
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
      const apiResponse = await sslcz.init(data);
      // console.log(apiResponse);
      if (apiResponse.status === 'SUCCESS') {
        const gatewayPageURL = apiResponse?.GatewayPageURL;
        await handlePaymentSuccess(payload.userId, products, prisma);
        await updateProductAndVariations(products, prisma);
        return { gatewayPageURL };
      } else {
        throw new ApiError(400, 'Order confirm failed!');
      }
    } else {
      await handlePaymentSuccess(payload.userId, products, prisma);
      await updateProductAndVariations(products, prisma);
      // Emit orderCreated event

      // const user = await prisma.user.findUnique({
      //   where: {
      //     id: payload?.userId,
      //   },
      // });

      // Send order summary email after successful order
      const emailSubject = 'Thank You for Your Order!';

      const getOrder = await prisma.order.findUnique({
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
        await sendEmail(
          email as string,
          emailSubject,
          emailTemplate(getOrder, getOrder, firstName, lastName),
        );
      }

      return initialOrder;
    }
  });
};

// clear cart items after order
const handlePaymentSuccess = async (
  userId: string,
  products: any[],
  prisma: any,
) => {
  const cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'cart not found!');
  }

  const conditions = products.map((product: any) => ({
    cartId: cart.id,
    productId: product.productId,
  }));

  await prisma.cartItem.deleteMany({
    where: {
      OR: conditions,
    },
  });
};

const getAllFromDB = async (): Promise<IOrder> => {
  const result = await prisma.order.findMany({
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

  const total = await prisma.order.count({});

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.findUnique({
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
};

const getOrderByOrderId = async (orderId: string): Promise<Order | null> => {
  const result = await prisma.order.findFirst({
    where: {
      orderId,
    },
  });
  return result;
};

const getMyOrderByIdFromDB = async (orderId: string): Promise<Order | null> => {
  const result = await prisma.order.findFirst({
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
};

const updateOneInDB = async (
  data: Order,
  id: string,
): Promise<Order | null> => {
  const result = await prisma.order.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const orderCancelUpdateProductAndVariations = async (
  orderItems: any[],
  prisma: any,
) => {
  // console.log(orderItems, 'for update function orderItems');
  for (const item of orderItems) {
    const { productId, quantity, color, size } = item;

    // Fetch the current product details
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (product) {
      // Work with the JSON variations directly
      const variations = product.variations; // Assuming product.variations is already an array

      // Find the corresponding variation
      const variationIndex = variations.findIndex(
        (variation: any) =>
          variation.color === color && variation.size === size,
      );

      if (variationIndex > -1) {
        // Update the quantity for the specific variation
        variations[variationIndex].quantity = (
          parseInt(variations[variationIndex].quantity) + quantity
        ).toString();

        // Update the product with new variations and stock
        await prisma.product.update({
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
};

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PACKING, OrderStatus.CANCELED],
  [OrderStatus.PACKING]: [OrderStatus.DELIVERED, OrderStatus.EXCHANGE],
  [OrderStatus.DELIVERED]: [OrderStatus.EXCHANGE],
  [OrderStatus.CANCELED]: [],
  [OrderStatus.EXCHANGE]: [],
};

const updateOrderStatus = async (
  id: string,
  payload: { status: OrderStatus },
): Promise<Order | null> => {
  const findOrder = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      orderItems: true,
    },
  });

  if (!findOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  const currentStatus = findOrder.status;

  // Validate the status transition
  const validNextStatuses = allowedTransitions[currentStatus];
  if (!validNextStatuses.includes(payload.status)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from ${currentStatus} to ${payload.status}!`,
    );
  }
  return await prisma.$transaction(async prisma => {
    if (payload.status === OrderStatus.CANCELED) {
      const updateOrderStatus = await prisma.order.update({
        where: {
          id: findOrder.id,
        },
        data: {
          status: payload.status,
        },
      });
      await orderCancelUpdateProductAndVariations(findOrder.orderItems, prisma);
      return updateOrderStatus;
    } else {
      const updateOrderStatus = await prisma.order.update({
        where: {
          id: findOrder.id,
        },
        data: {
          status: payload.status,
        },
      });
      return updateOrderStatus;
    }
  });
};

const deleteByIdFromDB = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.delete({
    where: {
      id,
    },
  });
  return result;
};

const getMyOrder = async (sessionId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      sessionId,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }

  const myOrder = await prisma.order.findMany({
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
};

const oderOverview = async (): Promise<any> => {
  const totalProduct = await prisma.product.count({});
  const total = await prisma.order.count({});
  const now = new Date();
  const todayTotal = await prisma.order.count({
    where: {
      createdAt: { gte: startOfDay(now), lt: endOfDay(now) },
    },
  });
  // Fetch all orders
  const orders = await prisma.order.findMany({
    select: {
      totalAmount: true,
      shippingCharge: true,
      createdAt: true,
    },
  });

  const todayOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startOfDay(now), lt: endOfDay(now) },
    },
    select: {
      totalAmount: true,
      shippingCharge: true,
      createdAt: true,
    },
  });

  const recentOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING,
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
  const monthlyData: { [key: string]: { order: number; revenue: number } } =
    monthNames.reduce(
      (acc, month) => {
        acc[month] = { order: 0, revenue: 0 };
        return acc;
      },
      {} as { [key: string]: { order: number; revenue: number } },
    );

  // Aggregate data by month
  orders.forEach(order => {
    const month = order.createdAt.toLocaleString('default', {
      month: 'long',
    }) as any;
    monthlyData[month]!.order += 1;
    monthlyData[month]!.revenue += order.totalAmount;
  });

  // Convert the aggregated data to the desired format
  const chartData: ChartData[] = monthNames.map(month => ({
    month,
    order: monthlyData[month]!.order,
    revenue: monthlyData[month]!.revenue,
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
};

const orderAnalytics = async (selectedValue: string): Promise<any> => {
  let dateFilter: any = {};

  const now = new Date();

  switch (selectedValue) {
    case 'today':
      dateFilter = { gte: startOfDay(now), lt: endOfDay(now) }; // All of today
      break;
    case 'last_week':
      dateFilter = { gte: startOfDay(subWeeks(now, 1)), lt: startOfDay(now) }; // From the start of last week to the start of today
      break;
    case 'last_month':
      dateFilter = { gte: startOfDay(subMonths(now, 1)), lt: startOfDay(now) }; // From the start of last month to the start of today
      break;
    case 'last_year':
      dateFilter = { gte: startOfDay(subYears(now, 1)), lt: startOfDay(now) }; // From the start of last year to the start of today
      break;
    case 'all':
    default:
      dateFilter = {}; // No date filter for 'all'
      break;
  }

  const whereClause = selectedValue === 'all' ? {} : { createdAt: dateFilter };

  // Run queries in parallel
  const [
    orderCancelled,
    orderPending,
    orderConfirmed,
    orderPacking,
    orderDelivered,
    orderExchange,
  ] = await Promise.all([
    prisma.order.count({
      where: { status: OrderStatus.CANCELED, ...whereClause },
    }),
    prisma.order.count({
      where: { status: OrderStatus.PENDING, ...whereClause },
    }),
    prisma.order.count({
      where: { status: OrderStatus.CONFIRMED, ...whereClause },
    }),
    prisma.order.count({
      where: { status: OrderStatus.PACKING, ...whereClause },
    }),
    prisma.order.count({
      where: { status: OrderStatus.DELIVERED, ...whereClause },
    }),
    prisma.order.count({
      where: { status: OrderStatus.EXCHANGE, ...whereClause },
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
};

const getDailyDataForMonth = async (year: number, month: number) => {
  // Get the total number of days in the month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Fetch all orders within the specified month and year
  const orders = await prisma.order.findMany({
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
  const dailyData: { [date: string]: { sale: number; revenue: number } } = {};

  // Aggregate data by day
  orders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0] as any; // Get the date in 'YYYY-MM-DD' format
    if (!dailyData[date]) {
      dailyData[date] = { sale: 0, revenue: 0 };
    }
    dailyData[date].sale += 1;
    dailyData[date].revenue += order.totalAmount;
  });

  // Generate the full list of dates for the month and fill with data
  const chartData = Array.from({ length: daysInMonth }, (_, day) => {
    const date = new Date(year, month - 1, day + 1)
      .toISOString()
      .split('T')[0] as any;
    return {
      date,
      sale: dailyData[date]?.sale || 0,
      revenue: dailyData[date]?.revenue || 0,
    };
  });

  return {
    chartData,
  };
};

const getTopTenProducts = async () => {
  const topProducts = await prisma.orderItem.groupBy({
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

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  return products.map(product => {
    const matchedProduct = topProducts.find(
      item => item.productId === product.id,
    );
    return {
      ...product,
      totalQuantitySold: matchedProduct?._sum.quantity || 0,
      totalRevenue: matchedProduct?._sum.price || 0,
    };
  });
};

const getTopTenCategories = async () => {
  const productQuantities = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
      price: true, // Summing up the price to calculate total revenue
    },
  });

  const categoryCount: Record<
    string,
    { totalQuantity: number; totalRevenue: number }
  > = {};

  for (const item of productQuantities) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { categoryId: true },
    });

    if (product?.categoryId) {
      if (!categoryCount[product.categoryId]) {
        categoryCount[product.categoryId] = {
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      categoryCount[product.categoryId]!.totalQuantity +=
        item._sum.quantity || 0;
      categoryCount[product.categoryId]!.totalRevenue += item._sum.price || 0;
    }
  }

  const sortedCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b.totalQuantity - a.totalQuantity)
    .slice(0, 10);

  const categoryIds = sortedCategories.map(([categoryId]) => categoryId);

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });

  return categories.map((category: any) => {
    const matchedCategory = categoryCount[category.id];
    return {
      ...category,
      totalQuantitySold: matchedCategory?.totalQuantity || 0,
      totalRevenue: matchedCategory?.totalRevenue || 0,
    };
  });
};

const deleteMultipleData = async (ids: string[]) => {
  const result = await prisma.order.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  return result;
};

export const OrderService = {
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
