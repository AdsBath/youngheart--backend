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
exports.ProductCollectionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateSlug_1 = __importDefault(require("../../../utils/generateSlug"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, generateSlug_1.default)(data.name);
    data.slug = slug;
    const existingCollection = yield prisma_1.default.productCollection.findFirst({
        where: {
            name: data.name,
            slug: slug,
        },
    });
    // let result: ProductCollection;
    const existingDisplayOrder = yield prisma_1.default.productCollection.findFirst({
        where: {
            displayOrder: data === null || data === void 0 ? void 0 : data.displayOrder,
        },
    });
    if (existingDisplayOrder) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already this display order Added!');
    }
    if (existingCollection) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already Existing Collection!');
    }
    const result = yield prisma_1.default.productCollection.create({
        data,
    });
    return result;
});
const getAllFromDB = (searchText) => __awaiter(void 0, void 0, void 0, function* () {
    let queryOptions = {};
    // Applying search functionality
    if (searchText) {
        queryOptions = Object.assign(Object.assign({}, queryOptions), { where: {
                OR: [
                    { name: { contains: searchText } },
                    // Add more fields if you want to search in additional fields
                ],
            } });
    }
    const result = yield prisma_1.default.productCollection.findMany(Object.assign(Object.assign({}, queryOptions), { orderBy: { displayOrder: 'asc' }, include: {
            products: {
                orderBy: { createdAt: 'desc' },
                where: {
                    showInHomeCollection: true,
                },
            },
            productProductCollections: {
                where: {
                    product: {
                        showInHomeCollection: true,
                    },
                },
                include: {
                    product: true,
                },
                orderBy: {
                    product: { createdAt: 'desc' },
                },
            },
        } }));
    const total = yield prisma_1.default.productCollection.count({});
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productCollection.findUnique({
        where: {
            id,
        },
        include: {
            products: {
                orderBy: { createdAt: 'desc' },
            },
            productProductCollections: {
                include: {
                    product: true,
                },
                orderBy: {
                    product: { createdAt: 'desc' },
                },
            },
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productCollection.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productCollection.delete({
        where: {
            id,
        },
    });
    return result;
});
const deleteMultipleData = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.productCollection.deleteMany({
        where: {
            id: { in: ids },
        },
    });
    return {
        message: 'Collections deleted succesfully',
    };
});
exports.ProductCollectionService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    deleteMultipleData,
};
