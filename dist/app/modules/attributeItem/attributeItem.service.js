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
exports.AttributeItemService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingAttribute = yield prisma_1.default.attributeItem.findFirst({
        where: {
            name: data.name,
        },
    });
    let result;
    if (existingAttribute) {
        result = yield prisma_1.default.attributeItem.update({
            where: {
                id: existingAttribute.id,
            },
            data,
        });
    }
    else {
        result = yield prisma_1.default.attributeItem.create({
            data,
        });
    }
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.attributeItem.findMany({
        orderBy: { createdAt: 'desc' },
    });
    const total = yield prisma_1.default.attributeItem.count({});
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.attributeItem.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.attributeItem.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.attributeItem.delete({
        where: {
            id,
        },
    });
    return result;
});
const deleteMultipleData = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.attributeItem.deleteMany({
        where: {
            id: { in: ids },
        },
    });
    return {
        message: 'Collections deleted succesfully',
    };
});
exports.AttributeItemService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    deleteMultipleData,
};
