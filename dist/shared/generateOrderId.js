"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = void 0;
const generateOrderId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};
exports.generateOrderId = generateOrderId;
