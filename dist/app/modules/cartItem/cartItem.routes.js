"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemRoutes = void 0;
const express_1 = require("express");
const cartItem_controller_1 = require("./cartItem.controller");
const router = (0, express_1.Router)();
router.post('/increment', cartItem_controller_1.CartItemController.incrementQuantity);
router.post('/decrement', cartItem_controller_1.CartItemController.decrementQuantity);
exports.CartItemRoutes = router;
