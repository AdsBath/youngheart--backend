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
exports.ShippingRulesService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingShippingRule = yield prisma_1.default.shippingRule.findFirst({
        where: {
            name: data.name,
        },
    });
    let result;
    if (existingShippingRule) {
        result = yield prisma_1.default.shippingRule.update({
            where: {
                id: existingShippingRule.id,
            },
            data,
        });
    }
    else {
        result = yield prisma_1.default.shippingRule.create({
            data,
        });
    }
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shippingRule.findMany({
        orderBy: { id: 'desc' },
    });
    const total = yield prisma_1.default.shippingRule.count({});
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shippingRule.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shippingRule.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shippingRule.delete({
        where: {
            id,
        },
    });
    return result;
});
const deleteMultipleData = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shippingRule.deleteMany({
        where: {
            id: { in: ids },
        },
    });
    return result;
});
exports.ShippingRulesService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    deleteMultipleData,
};
