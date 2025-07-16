/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Product, Status } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { imageDestroy } from '../../../helpers/imageDestroy';
import prisma from '../../../shared/prisma';
import generateSlug from '../../../utils/generateSlug';

const insertIntoDB = async (data: any): Promise<Product | null> => {
  const {
    stockInQuantity,
    restockInQuantity,
    stockInDate,
    restockDate,
    expireDate,
    productCollections,
    features,
    ...productData
  } = data;

  const newTotalQuantity = data?.variations.reduce(
    (acc: number, item: { quantity: any }) =>
      acc + parseInt(item.quantity || '0'),
    0,
  );
  const slug = generateSlug(data.name);
  productData.slug = slug + '-' + data?.sku;
  productData.stock = newTotalQuantity.toString();

  return await prisma.$transaction(async prisma => {
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingSku) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Already have same SKU product please change some charecter!',
      );
    }

    // if (features.length === 0) {
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     'Please add at least one feature',
    //   );
    // }
    const result = await prisma.product.create({
      data: {
        ...productData,
        // features: {
        //   connect: validFeatures,
        // },
        features: {
          create: features.map((feature: any) => ({
            feature: {
              connect: { id: feature.value },
            },
          })),
        },
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Product creation failed');
    }

    const inventory = await prisma.inventory.create({
      data: {
        productId: result.id,
        currentQuantity: newTotalQuantity.toString(),
      },
    });

    if (inventory) {
      await prisma.inventoryNote.create({
        data: {
          inventoryId: inventory.id,
          stockInQuantity,
          restockInQuantity,
          stockInDate,
          restockDate,
          expireDate,
        },
      });
    }

    await Promise.all(
      productCollections.map(async (collection: any) => {
        await prisma.productProductCollection.create({
          data: {
            productId: result.id,
            productCollectionId: collection.id,
          },
        });
      }),
    );

    return result;
  });
};

const getAllFromDB = async (
  search: string,
  collectionId?: string,
): Promise<any> => {
  let collectionCondition = {};

  if (collectionId) {
    const productCollection = await prisma.productCollection.findUnique({
      where: {
        id: collectionId,
      },
      include: {
        productProductCollections: {
          include: {
            product: true,
          },
        },
      },
    });

    if (productCollection) {
      const productIds = productCollection.productProductCollections.map(
        (productCollectionItem: any) => productCollectionItem.product.id,
      );

      collectionCondition = {
        id: {
          in: productIds,
        },
      };
    } else {
      return {
        total: 0,
        data: [],
      };
    }
  }

  const searchConditions = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            metaTitle: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }
    : {};

  const whereCondition = {
    AND: [collectionCondition, searchConditions].filter(Boolean),
  };

  const [result, total] = await Promise.all([
    prisma.product.findMany({
      where: { ...whereCondition },
      include: {
        inventories: true,
        bundleDiscount: true,
        category: true,
        productProductCollections: {
          include: {
            productCollection: true,
          },
        },
        shippingRules: true,
        abandonedCartItems: true,
        orderItems: true,
        coupons: true,
        productReviews: true,
        wishlists: true,
        ProductCollection: true,
        cartItems: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({
      where: whereCondition,
    }),
  ]);

  return {
    total: total,
    data: result,
  };
};

const getRelatedProductFromDB = async (categoryId: string): Promise<any> => {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      inventories: true,
      bundleDiscount: true,
      category: true,
      productProductCollections: {
        include: {
          productCollection: true,
        },
      },
      shippingRules: true,
      abandonedCartItems: true,
      orderItems: true,
      coupons: true,
      productReviews: true,
      wishlists: true,
      ProductCollection: true,
      cartItems: true,
    },
  });

  const total = await prisma.product.count({
    where: {
      categoryId,
    },
  });

  return {
    total: total,
    data: products,
  };
};

type ProductCollectionWithProducts = {
  collectionId: string;
  collectionName: string;
  products: Product[];
};

const getProductsByCollection = async (): Promise<
  ProductCollectionWithProducts[]
> => {
  const productCollections = await prisma.productProductCollection.findMany({
    where: {
      product: {
        status: Status.published,
      },
    },
    include: {
      product: {
        include: {
          shippingRules: true,
        },
      },
      productCollection: true,
    },
  });

  // Group products by their collection ID
  const groupedByCollection = productCollections.reduce((acc, item) => {
    const collectionId = item.productCollectionId;
    const collectionName = item.productCollection.name;

    let collection = acc.find(c => c.collectionId === collectionId);

    if (!collection) {
      collection = { collectionId, collectionName, products: [] };
      acc.push(collection);
    }

    collection.products.push(item.product);
    return acc;
  }, [] as ProductCollectionWithProducts[]);

  return groupedByCollection;
};

const getOfferProduct = async (): Promise<Product[]> => {
  const offerProduct = await prisma.product.findMany({
    where: {
      bundleDiscountId: { not: null },
      status: Status.published,
      showInOffer: true,
    },
    include: {
      inventories: true,
      bundleDiscount: true,
      category: true,
      productProductCollections: {
        include: {
          productCollection: true,
        },
      },
      shippingRules: true,
      abandonedCartItems: true,
      orderItems: true,
      coupons: true,
      productReviews: true,
      wishlists: true,
      ProductCollection: true,
      cartItems: true,
    },
  });
  return offerProduct;
};
const getAllOfferProduct = async (): Promise<Product[]> => {
  const offerProduct = await prisma.product.findMany({
    where: {
      bundleDiscountId: { not: null },
      status: Status.published,
    },
    include: {
      inventories: true,
      bundleDiscount: true,
      category: true,
      productProductCollections: {
        include: {
          productCollection: true,
        },
      },
      shippingRules: true,
      abandonedCartItems: true,
      orderItems: true,
      coupons: true,
      productReviews: true,
      wishlists: true,
      ProductCollection: true,
      cartItems: true,
    },
  });
  return offerProduct;
};

const getByIdFromDB = async (id: string): Promise<any> => {
  const result = await prisma.product.findFirst({
    where: {
      id,
    },
    include: {
      inventories: true,
      bundleDiscount: true,
      category: true,
      productProductCollections: {
        include: {
          productCollection: true,
        },
      },
      features: {
        include: {
          feature: true,
        },
      },
      shippingRules: true,
      abandonedCartItems: true,
      orderItems: true,
      coupons: true,
      productReviews: true,
      wishlists: true,
      ProductCollection: true,
      cartItems: true,
    },
  });
  return result;
};

const getProductByIdFromDB = async (slug: string): Promise<any> => {
  const result = await prisma.product.findFirst({
    where: {
      slug,
    },
    include: {
      inventories: true,
      bundleDiscount: true,
      category: true,
      productProductCollections: {
        include: {
          productCollection: true,
        },
      },
      shippingRules: true,
      abandonedCartItems: true,
      orderItems: true,
      coupons: true,
      productReviews: true,
      wishlists: true,
      ProductCollection: true,
      cartItems: true,
      features: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  data: any,
  id: string,
): Promise<Product | null> => {
  const {
    stockInQuantity,
    restockInQuantity,
    stockInDate,
    restockDate,
    expireDate,
    productCollections,
    categoryId,
    brandId,
    features,
    bundleDiscountId,
    ...productData
  } = data;

  const newTotalQuantity = data?.variations?.reduce(
    (acc: number, item: { quantity: any }) =>
      acc + parseInt(item.quantity || '0'),
    0,
  );

  const slug = generateSlug(data.name);
  productData.slug = slug + '-' + data?.sku;
  productData.stock = newTotalQuantity?.toString() || '0';
  return await prisma.$transaction(async prisma => {
    const result = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        category: {
          connect: {
            id: categoryId,
          },
        },
        brand: brandId ? { connect: { id: brandId } } : undefined,
        bundleDiscount: bundleDiscountId
          ? {
              connect: {
                id: bundleDiscountId,
              },
            }
          : undefined,
      },
    });

    if (features && features.length > 0) {
      const existingFeatures = await prisma.productFeature
        .findMany({
          where: { productId: id },
          select: { featureId: true },
        })
        .then(records => records.map(r => r.featureId));

      const featuresToAdd = features.filter(
        (featureId: any) => !existingFeatures.includes(featureId.value),
      );
      const featuresToRemove = existingFeatures.filter(
        featureId => !features.map((f: any) => f.value).includes(featureId),
      );

      // Remove obsolete features
      if (featuresToRemove.length > 0) {
        await prisma.productFeature.deleteMany({
          where: {
            productId: id,
            featureId: { in: featuresToRemove },
          },
        });
      }

      for (const featureId of featuresToAdd) {
        try {
          await prisma.productFeature.create({
            data: {
              productId: id,
              featureId: featureId.value,
            },
          });
        } catch (error: any) {
          if (error.code !== 'P2002') {
            throw error; // Only ignore unique constraint violations
          }
        }
      }
    }
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Product update failed');
    }

    const existingSku = await prisma.product.findUnique({
      where: {
        sku: data.sku,
      },
    });

    if (existingSku && existingSku.sku !== result.sku) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Already have same SKU product please change some charecter!',
      );
    }

    await prisma.productProductCollection.deleteMany({
      where: { productId: result.id },
    });

    // Create new product collections
    await Promise.all(
      productCollections.map(async (collection: any) => {
        await prisma.productProductCollection.create({
          data: {
            productId: result.id,
            productCollectionId: collection.id,
          },
        });
      }),
    );

    return result;
  });
};
const deleteByIdFromDB = async (id: string): Promise<any> => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found!');
  }

  function mergeStringAndArray(
    singleString: string,
    stringArray: string[],
  ): string[] {
    // Convert singleString to an array
    const singleStringArray: string[] = [singleString];

    // Merge the single string (now an array) with the string array
    return singleStringArray.concat(stringArray);
  }

  const imageUrls = mergeStringAndArray(
    product.thumbnail,
    product.images || [],
  );

  function getLastSlashValues(urls: string[]): string[] {
    return urls.map(url => {
      const parts = url.split('/');
      return parts[parts.length - 1];
    });
  }

  const lastUrls = getLastSlashValues(imageUrls);
  // Create new items
  await Promise.all(
    lastUrls.map(async (publicId: string) => {
      await imageDestroy(publicId);
    }),
  );

  // console.log(lastUrls);
  // const res = await imageDestroy(product.thumbnail);

  // console.log(res);

  const result = await prisma.product.update({
    where: { id },
    data: {
      status: 'archived',
    },
    include: {
      inventories: true,
      bundleDiscount: true,
      category: true,
      productProductCollections: {
        include: {
          productCollection: true,
        },
      },
      shippingRules: true,
      abandonedCartItems: true,
      orderItems: true,
      coupons: true,
      productReviews: true,
      wishlists: true,
      ProductCollection: true,
      cartItems: true,
    },
  });
  return result;
};

const deleteMultipleData = async (ids: string[]) => {
  const result = await prisma.product.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  return result;
};

export const ProductService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  getOfferProduct,
  deleteByIdFromDB,
  getProductByIdFromDB,
  getRelatedProductFromDB,
  getProductsByCollection,
  deleteMultipleData,
  getAllOfferProduct,
};
