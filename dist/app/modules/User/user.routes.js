"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
//customer routes
router.get('/', user_controller_1.UserController.getAllData);
router.get('/current/:id', user_controller_1.UserController.getUserBySessionId);
router.get('/get-me', user_controller_1.UserController.getMe);
// admin routes
router.get('/admin-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EMPLOYEE, user_1.ENUM_USER_ROLE.MANAGER), user_controller_1.UserController.adminProfile);
router.get('/all-admin', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.MANAGER), user_controller_1.UserController.allAdmin);
router.get('/admin/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.MANAGER), user_controller_1.UserController.getAdminById);
router.get('/:id', user_controller_1.UserController.getUserById);
router.post('/', user_controller_1.UserController.insertIntoDb);
router.patch('/:id', user_controller_1.UserController.updateUser);
router.delete('/:id', user_controller_1.UserController.deleteUser);
router.delete('/delete-admin/:id', user_controller_1.UserController.deleteAllAdmin);
router.delete('/delete-guest', user_controller_1.UserController.deleteAllAdmin);
router.delete('/delete-register', user_controller_1.UserController.deleteAllAdmin);
exports.UserRoutes = router;
