import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.routes';
import { AbandonedCartRoutes } from '../modules/abandonedCart/abandonedCart.routes';
import { AddressRoutes } from '../modules/address/address.routes';
import { ApplicationRoutes } from '../modules/application/application.routes';
import { AttributeRoutes } from '../modules/attribute/attribute.routes';
import { AttributeItemRoutes } from '../modules/attributeItem/attributeItem.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { BannerRoutes } from '../modules/banner/banner.routes';
import { BannerAdRoutes } from '../modules/bannerAd/bannerAd.routes';
import { BrandRoutes } from '../modules/barand/brand.route';
import { BlogRoutes } from '../modules/blog/blog.routes';
import { BundleDiscountRoutes } from '../modules/bundleDiscount/bundleDiscount.routes';
import { CareerRoutes } from '../modules/career/career.routes';
import { CartRoutes } from '../modules/cart/cart.routes';
import { CartItemRoutes } from '../modules/cartItem/cartItem.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { CouponRoutes } from '../modules/coupon/coupon.routes';
import { CustomDesignRoutes } from '../modules/customDesign/customDesign.routes';
import { DiscountBannerRoutes } from '../modules/discountBanner/discountBanner.routes';
import { FeatureRoutes } from '../modules/feature/feature.route';
import { ImageRoutes } from '../modules/image/image.routes';
import { InventoryRoutes } from '../modules/inventory/inventory.routes';
import { OrderRoutes } from '../modules/order/order.routes';
import { OrderNotificationRoutes } from '../modules/orderNotification/orderNotification.routes';
import { PageRoutes } from '../modules/page/page.routes';
import { ProductRoutes } from '../modules/product/product.routes';
import { ProductCollectionRoutes } from '../modules/productCollection/productCollection.routes';
import { ProductProductCollectionRoutes } from '../modules/productProductCollection/productProductCollection.routes';
import { ShippingRulesRoutes } from '../modules/shippingRules/shippingRules.routes';
import { WishlistRoutes } from '../modules/wishlist/wishlist.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/brands',
    route: BrandRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/product-collection',
    route: ProductCollectionRoutes,
  },
  {
    path: '/attribute-item',
    route: AttributeItemRoutes,
  },
  {
    path: '/attribute',
    route: AttributeRoutes,
  },
  {
    path: '/bundle-discount',
    route: BundleDiscountRoutes,
  },
  {
    path: '/address',
    route: AddressRoutes,
  },
  {
    path: '/cart',
    route: CartRoutes,
  },
  {
    path: '/abandoned-cart',
    route: AbandonedCartRoutes,
  },
  {
    path: '/cart-item',
    route: CartItemRoutes,
  },
  {
    path: '/image',
    route: ImageRoutes,
  },
  {
    path: '/inventory',
    route: InventoryRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '/banner',
    route: BannerRoutes,
  },
  {
    path: '/product-product-collection',
    route: ProductProductCollectionRoutes,
  },
  {
    path: '/coupon',
    route: CouponRoutes,
  },
  {
    path: '/shipping-rules',
    route: ShippingRulesRoutes,
  },
  {
    path: '/wishlist',
    route: WishlistRoutes,
  },
  {
    path: '/banner-ad',
    route: BannerAdRoutes,
  },
  {
    path: '/page',
    route: PageRoutes,
  },
  {
    path: '/career',
    route: CareerRoutes,
  },
  {
    path: '/blog',
    route: BlogRoutes,
  },
  {
    path: '/notifications',
    route: OrderNotificationRoutes,
  },
  {
    path: '/discount-banner',
    route: DiscountBannerRoutes,
  },
  {
    path: '/application',
    route: ApplicationRoutes,
  },
  {
    path: '/custom-design',
    route: CustomDesignRoutes,
  },
  {
    path: '/feature',
    route: FeatureRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
