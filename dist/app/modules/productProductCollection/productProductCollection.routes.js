"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductProductCollectionRoutes = void 0;
const express_1 = require("express");
const productProductCollection_controler_1 = require("./productProductCollection.controler");
const router = (0, express_1.Router)();
router.get('/', productProductCollection_controler_1.ProductProductCollectionController.getAllFromDB);
exports.ProductProductCollectionRoutes = router;
