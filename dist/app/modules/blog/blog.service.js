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
exports.BlogService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateSlug_1 = __importDefault(require("../../../utils/generateSlug"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, generateSlug_1.default)(data.title);
    data.slug = slug;
    const existingBlog = yield prisma_1.default.blog.findFirst({
        where: {
            slug,
        },
    });
    if (existingBlog) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already this title Added!');
    }
    const blog = yield prisma_1.default.blog.create({
        data: Object.assign({}, data),
    });
    return blog;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
        },
    });
    const total = yield prisma_1.default.blog.count({});
    return {
        total: total,
        data: result,
    };
});
const getAllForFrontend = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findMany({
        where: {
            isActive: true,
        },
        include: {
            author: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    const total = yield prisma_1.default.blog.count({
        where: {
            isActive: true,
        },
    });
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findUnique({
        where: {
            id,
        },
        include: {
            author: true,
        },
    });
    return result;
});
const getBySlugFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findFirst({
        where: {
            slug,
        },
        include: {
            author: true,
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBlog = yield prisma_1.default.blog.findUnique({
        where: {
            id,
        },
    });
    if (!existingBlog) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found!');
    }
    const result = yield prisma_1.default.blog.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBlog = yield prisma_1.default.blog.findUnique({
        where: {
            id,
        },
    });
    if (!existingBlog) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found!');
    }
    const result = yield prisma_1.default.blog.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.BlogService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    getAllForFrontend,
    getBySlugFromDB,
};
