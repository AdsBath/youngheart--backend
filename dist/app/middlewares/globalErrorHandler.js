"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const handleClintError_1 = __importDefault(require("../../errors/handleClintError"));
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const config_1 = __importDefault(require("../../config"));
const globalErrorHandler = (error, req, res, next) => {
    config_1.default.env === 'development'
        ? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
        : console.error(`🐱‍🏍 globalErrorHandler ~~`, error);
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorMessages = [];
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, handleValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            statusCode = 400;
            message = 'Unique constraint failed';
            if (error.meta &&
                typeof error.meta.target === 'object' &&
                Array.isArray(error.meta.target)) {
                errorMessages = error.meta.target.map(field => ({
                    path: field,
                    message: `${field} already exists.`,
                }));
            }
            else {
                errorMessages = [
                    {
                        path: '',
                        message: 'Unique constraint failed on unspecified fields.',
                    },
                ];
            }
        }
        else {
            const simplifiedError = (0, handleClintError_1.default)(error);
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
            errorMessages = simplifiedError.errorMessages;
        }
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        errorMessages,
        stack: config_1.default.env === 'production' ? undefined : error === null || error === void 0 ? void 0 : error.stack,
    });
};
exports.default = globalErrorHandler;
//  else if (error instanceof Prisma.PrismaClientInitializationError) {
//     message = 'Failed to initialize database connection.';
//     errorMessages = [
//       {
//         path: '',
//         message: 'Failed to initialize database connection.',
//       },
//     ];
//   }
