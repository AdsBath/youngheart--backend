"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    errorFormat: 'minimal',
    transactionOptions: {
        timeout: 20000, // Set the timeout to 20 seconds
        maxWait: 5000, // Set the maximum wait time to 5 seconds
    },
});
exports.default = prisma;
