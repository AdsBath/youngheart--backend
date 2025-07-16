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
// import { errorLogger, logger } from './shared/logger';
const ws_1 = __importDefault(require("ws"));
require("./app/listeners/notificationLiseners"); // Import the listener
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const notificationEmitter_1 = __importDefault(require("./app/events/notificationEmitter"));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = app_1.default.listen(config_1.default.port, () => {
            console.log(`👽 Server running on port 🔦 ${config_1.default.port}` + ' 🚀 ' + config_1.default.env);
        });
        const wss = new ws_1.default.Server({ server });
        wss.on('connection', ws => {
            console.log('Client connected to WebSocket');
            ws.on('close', () => {
                console.log('Client disconnected from WebSocket');
            });
            // Listen for notifications and send them to the connected client
            notificationEmitter_1.default.on('orderCreated', order => {
                ws.send(JSON.stringify({
                    type: 'orderCreated',
                    message: `Your order #${order.id} has been created!`,
                    orderId: order.id,
                }));
            });
        });
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log('Server closed 🔒');
                });
            }
            process.exit(1);
        };
        const unexpectedErrorHandler = (error) => {
            // errorLogger.error(error);
            console.error(error);
            exitHandler();
        };
        process.on('uncaughtException', unexpectedErrorHandler);
        process.on('unhandledRejection', unexpectedErrorHandler);
        process.on('SIGTERM', () => {
            // logger.info('SIGTERM received');
            console.log('SIGTERM received');
            if (server) {
                server.close();
            }
        });
    });
}
bootstrap();
