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
const notificationEmitter_1 = __importDefault(require("../events/notificationEmitter"));
// Handling orderCreated event
notificationEmitter_1.default.on('orderCreated', order => {
    // Example: Send email notification
    sendEmailNotification(order.userId, 'Your order has been created!', order);
    // Example: Send real-time notification (WebSocket, Pusher, etc.)
    sendRealTimeNotification(order.userId, 'Your order has been created!');
});
const sendEmailNotification = (userId, subject, order) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement email sending logic here
    console.log(`Email sent to user ${userId} with subject: ${subject}`);
    console.log(order, 'order');
});
const sendRealTimeNotification = (userId, message) => {
    // Implement real-time notification logic here (e.g., using WebSocket, Pusher)
    console.log(`Real-time notification sent to user ${userId}: ${message}`);
};
