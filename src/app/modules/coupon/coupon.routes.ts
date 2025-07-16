import { Router } from 'express';
import { CouponController } from './coupon.controller';

const router = Router();

router.get('/', CouponController.getAllFromDB);
router.get('/:id', CouponController.getByIdFromDB);
router.post('/add', CouponController.insertIntoDB);
router.post('/apply-coupon', CouponController.applyCoupon);
router.patch('/:id', CouponController.updateOneInDB);
router.delete('/:id', CouponController.deleteByIdFromDB);

export const CouponRoutes = router;
