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
exports.ProductService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const imageDestroy_1 = require("../../../helpers/imageDestroy");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateSlug_1 = __importDefault(require("../../../utils/generateSlug"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { stockInQuantity, restockInQuantity, stockInDate, restockDate, expireDate, productCollections, features } = data, productData = __rest(data, ["stockInQuantity", "restockInQuantity", "stockInDate", "restockDate", "expireDate", "productCollections", "features"]);
    const newTotalQuantity = data === null || data === void 0 ? void 0 : data.variations.reduce((acc, item) => acc + parseInt(item.quantity || '0'), 0);
    const slug = (0, generateSlug_1.default)(data.name);
    productData.slug = slug + '-' + (data === null || data === void 0 ? void 0 : data.sku);
    productData.stock = newTotalQuantity.toString();
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const existingSku = yield prisma.product.findUnique({
            where: { sku: data.sku },
        });
        if (existingSku) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already have same SKU product please change some charecter!');
        }
        // if (features.length === 0) {
        //   throw new ApiError(
        //     httpStatus.BAD_REQUEST,
        //     'Please add at least one feature',
        //   );
        // }
        const result = yield prisma.product.create({
            data: Object.assign(Object.assign({}, productData), { 
                // features: {
                //   connect: validFeatures,
                // },
                features: {
                    create: features.map((feature) => ({
                        feature: {
                            connect: { id: feature.value },
                        },
                    })),
                } }),
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Product creation failed');
        }
        const inventory = yield prisma.inventory.create({
            data: {
                productId: result.id,
                currentQuantity: newTotalQuantity.toString(),
            },
        });
        if (inventory) {
            yield prisma.inventoryNote.create({
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
        yield Promise.all(productCollections.map((collection) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.productProductCollection.create({
                data: {
                    productId: result.id,
                    productCollectionId: collection.id,
                },
            });
        })));
        return result;
    }));
});
const getAllFromDB = (search, collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    let collectionCondition = {};
    if (collectionId) {
        const productCollection = yield prisma_1.default.productCollection.findUnique({
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
            const productIds = productCollection.productProductCollections.map((productCollectionItem) => productCollectionItem.product.id);
            collectionCondition = {
                id: {
                    in: productIds,
                },
            };
        }
        else {
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
    const [result, total] = yield Promise.all([
        prisma_1.default.product.findMany({
            where: Object.assign({}, whereCondition),
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
        prisma_1.default.product.count({
            where: whereCondition,
        }),
    ]);
    return {
        total: total,
        data: result,
    };
});
const getRelatedProductFromDB = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma_1.default.product.findMany({
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
    const total = yield prisma_1.default.product.count({
        where: {
            categoryId,
        },
    });
    return {
        total: total,
        data: products,
    };
});
const getProductsByCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const productCollections = yield prisma_1.default.productProductCollection.findMany({
        where: {
            product: {
                status: client_1.Status.published,
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
    }, []);
    return groupedByCollection;
});
const getOfferProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    const offerProduct = yield prisma_1.default.product.findMany({
        where: {
            bundleDiscountId: { not: null },
            status: client_1.Status.published,
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
});
const getAllOfferProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    const offerProduct = yield prisma_1.default.product.findMany({
        where: {
            bundleDiscountId: { not: null },
            status: client_1.Status.published,
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
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findFirst({
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
});
const getProductByIdFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findFirst({
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
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { stockInQuantity, restockInQuantity, stockInDate, restockDate, expireDate, productCollections, categoryId, brandId, features, bundleDiscountId } = data, productData = __rest(data, ["stockInQuantity", "restockInQuantity", "stockInDate", "restockDate", "expireDate", "productCollections", "categoryId", "brandId", "features", "bundleDiscountId"]);
    const newTotalQuantity = (_a = data === null || data === void 0 ? void 0 : data.variations) === null || _a === void 0 ? void 0 : _a.reduce((acc, item) => acc + parseInt(item.quantity || '0'), 0);
    const slug = (0, generateSlug_1.default)(data.name);
    productData.slug = slug + '-' + (data === null || data === void 0 ? void 0 : data.sku);
    productData.stock = (newTotalQuantity === null || newTotalQuantity === void 0 ? void 0 : newTotalQuantity.toString()) || '0';
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma.product.update({
            where: { id },
            data: Object.assign(Object.assign({}, productData), { category: {
                    connect: {
                        id: categoryId,
                    },
                }, brand: brandId ? { connect: { id: brandId } } : undefined, bundleDiscount: bundleDiscountId
                    ? {
                        connect: {
                            id: bundleDiscountId,
                        },
                    }
                    : undefined }),
        });
        if (features && features.length > 0) {
            const existingFeatures = yield prisma.productFeature
                .findMany({
                where: { productId: id },
                select: { featureId: true },
            })
                .then(records => records.map(r => r.featureId));
            const featuresToAdd = features.filter((featureId) => !existingFeatures.includes(featureId.value));
            const featuresToRemove = existingFeatures.filter(featureId => !features.map((f) => f.value).includes(featureId));
            // Remove obsolete features
            if (featuresToRemove.length > 0) {
                yield prisma.productFeature.deleteMany({
                    where: {
                        productId: id,
                        featureId: { in: featuresToRemove },
                    },
                });
            }
            for (const featureId of featuresToAdd) {
                try {
                    yield prisma.productFeature.create({
                        data: {
                            productId: id,
                            featureId: featureId.value,
                        },
                    });
                }
                catch (error) {
                    if (error.code !== 'P2002') {
                        throw error; // Only ignore unique constraint violations
                    }
                }
            }
        }
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Product update failed');
        }
        const existingSku = yield prisma.product.findUnique({
            where: {
                sku: data.sku,
            },
        });
        if (existingSku && existingSku.sku !== result.sku) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already have same SKU product please change some charecter!');
        }
        yield prisma.productProductCollection.deleteMany({
            where: { productId: result.id },
        });
        // Create new product collections
        yield Promise.all(productCollections.map((collection) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.productProductCollection.create({
                data: {
                    productId: result.id,
                    productCollectionId: collection.id,
                },
            });
        })));
        return result;
    }));
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id,
        },
    });
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'product not found!');
    }
    function mergeStringAndArray(singleString, stringArray) {
        // Convert singleString to an array
        const singleStringArray = [singleString];
        // Merge the single string (now an array) with the string array
        return singleStringArray.concat(stringArray);
    }
    const imageUrls = mergeStringAndArray(product.thumbnail, product.images || []);
    function getLastSlashValues(urls) {
        return urls.map(url => {
            const parts = url.split('/');
            return parts[parts.length - 1];
        });
    }
    const lastUrls = getLastSlashValues(imageUrls);
    // Create new items
    yield Promise.all(lastUrls.map((publicId) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, imageDestroy_1.imageDestroy)(publicId);
    })));
    // console.log(lastUrls);
    // const res = await imageDestroy(product.thumbnail);
    // console.log(res);
    const result = yield prisma_1.default.product.update({
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
});
const deleteMultipleData = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.deleteMany({
        where: {
            id: { in: ids },
        },
    });
    return result;
});
exports.ProductService = {
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
