"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/User/user.routes");
const abandonedCart_routes_1 = require("../modules/abandonedCart/abandonedCart.routes");
const address_routes_1 = require("../modules/address/address.routes");
const application_routes_1 = require("../modules/application/application.routes");
const attribute_routes_1 = require("../modules/attribute/attribute.routes");
const attributeItem_routes_1 = require("../modules/attributeItem/attributeItem.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const banner_routes_1 = require("../modules/banner/banner.routes");
const bannerAd_routes_1 = require("../modules/bannerAd/bannerAd.routes");
const brand_route_1 = require("../modules/barand/brand.route");
const blog_routes_1 = require("../modules/blog/blog.routes");
const bundleDiscount_routes_1 = require("../modules/bundleDiscount/bundleDiscount.routes");
const career_routes_1 = require("../modules/career/career.routes");
const cart_routes_1 = require("../modules/cart/cart.routes");
const cartItem_routes_1 = require("../modules/cartItem/cartItem.routes");
const category_routes_1 = require("../modules/category/category.routes");
const coupon_routes_1 = require("../modules/coupon/coupon.routes");
const customDesign_routes_1 = require("../modules/customDesign/customDesign.routes");
const discountBanner_routes_1 = require("../modules/discountBanner/discountBanner.routes");
const feature_route_1 = require("../modules/feature/feature.route");
const image_routes_1 = require("../modules/image/image.routes");
const inventory_routes_1 = require("../modules/inventory/inventory.routes");
const order_routes_1 = require("../modules/order/order.routes");
const orderNotification_routes_1 = require("../modules/orderNotification/orderNotification.routes");
const page_routes_1 = require("../modules/page/page.routes");
const product_routes_1 = require("../modules/product/product.routes");
const productCollection_routes_1 = require("../modules/productCollection/productCollection.routes");
const productProductCollection_routes_1 = require("../modules/productProductCollection/productProductCollection.routes");
const shippingRules_routes_1 = require("../modules/shippingRules/shippingRules.routes");
const wishlist_routes_1 = require("../modules/wishlist/wishlist.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: '/user',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/categories',
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: '/products',
        route: product_routes_1.ProductRoutes,
    },
    {
        path: '/brands',
        route: brand_route_1.BrandRoutes,
    },
    {
        path: '/orders',
        route: order_routes_1.OrderRoutes,
    },
    {
        path: '/product-collection',
        route: productCollection_routes_1.ProductCollectionRoutes,
    },
    {
        path: '/attribute-item',
        route: attributeItem_routes_1.AttributeItemRoutes,
    },
    {
        path: '/attribute',
        route: attribute_routes_1.AttributeRoutes,
    },
    {
        path: '/bundle-discount',
        route: bundleDiscount_routes_1.BundleDiscountRoutes,
    },
    {
        path: '/address',
        route: address_routes_1.AddressRoutes,
    },
    {
        path: '/cart',
        route: cart_routes_1.CartRoutes,
    },
    {
        path: '/abandoned-cart',
        route: abandonedCart_routes_1.AbandonedCartRoutes,
    },
    {
        path: '/cart-item',
        route: cartItem_routes_1.CartItemRoutes,
    },
    {
        path: '/image',
        route: image_routes_1.ImageRoutes,
    },
    {
        path: '/inventory',
        route: inventory_routes_1.InventoryRoutes,
    },
    {
        path: '/order',
        route: order_routes_1.OrderRoutes,
    },
    {
        path: '/banner',
        route: banner_routes_1.BannerRoutes,
    },
    {
        path: '/product-product-collection',
        route: productProductCollection_routes_1.ProductProductCollectionRoutes,
    },
    {
        path: '/coupon',
        route: coupon_routes_1.CouponRoutes,
    },
    {
        path: '/shipping-rules',
        route: shippingRules_routes_1.ShippingRulesRoutes,
    },
    {
        path: '/wishlist',
        route: wishlist_routes_1.WishlistRoutes,
    },
    {
        path: '/banner-ad',
        route: bannerAd_routes_1.BannerAdRoutes,
    },
    {
        path: '/page',
        route: page_routes_1.PageRoutes,
    },
    {
        path: '/career',
        route: career_routes_1.CareerRoutes,
    },
    {
        path: '/blog',
        route: blog_routes_1.BlogRoutes,
    },
    {
        path: '/notifications',
        route: orderNotification_routes_1.OrderNotificationRoutes,
    },
    {
        path: '/discount-banner',
        route: discountBanner_routes_1.DiscountBannerRoutes,
    },
    {
        path: '/application',
        route: application_routes_1.ApplicationRoutes,
    },
    {
        path: '/custom-design',
        route: customDesign_routes_1.CustomDesignRoutes,
    },
    {
        path: '/feature',
        route: feature_route_1.FeatureRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
