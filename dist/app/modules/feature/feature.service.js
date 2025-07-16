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
exports.FeatureService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateSlug_1 = __importDefault(require("../../../utils/generateSlug"));
const insertFeatureIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    data.slug = (0, generateSlug_1.default)(data.name);
    const result = yield prisma_1.default.feature.create({
        data, // Pass the data object directly
    });
    return result;
});
const getAllFeaturesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.feature.findMany({
        include: {
            products: {
                include: {
                    product: true,
                },
            },
        },
    });
});
// Get Feature by ID
const getFeatureByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.feature.findUnique({
        where: { id },
    });
});
// Update a Feature
const updateFeatureInDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.feature.update({
        where: { id },
        data,
    });
});
// Delete a Feature
const deleteFeatureFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.feature.delete({
        where: { id },
    });
});
exports.FeatureService = {
    insertFeatureIntoDB,
    getAllFeaturesFromDB,
    getFeatureByIdFromDB,
    updateFeatureInDB,
    deleteFeatureFromDB,
};
