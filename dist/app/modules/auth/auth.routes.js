"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.get('/mail', auth_controller_1.AuthController.mailTest);
router.post('/login', auth_controller_1.AuthController.login);
router.post('/checkout-login', auth_controller_1.AuthController.checkoutLogin);
router.post('/admin-login', auth_controller_1.AuthController.adminLogin);
router.post('/register', auth_controller_1.AuthController.register);
// admin create
router.post('/register-admin', auth_controller_1.AuthController.registerAdmin);
router.post('/logout', auth_controller_1.AuthController.logout);
router.patch('/change-password', auth_controller_1.AuthController.changePassword);
router.patch('/set-password', auth_controller_1.AuthController.setPassword);
router.patch('/forgot-password', auth_controller_1.AuthController.forgotPassword);
router.patch('/admin-forgot-password', auth_controller_1.AuthController.adminForgotPassword);
exports.AuthRoutes = router;
