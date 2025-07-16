import { Router } from 'express';
import { DiscountBannerController } from './discountBanner.controller';

const router = Router();

router.get('/', DiscountBannerController.getAllFromDB);
router.get('/frontend', DiscountBannerController.getDiscountBanner);
router.get('/:id', DiscountBannerController.getByIdFromDB);
router.post('/add', DiscountBannerController.insertIntoDB);
router.patch('/:id', DiscountBannerController.updateOneInDB);
router.delete('/:id', DiscountBannerController.deleteByIdFromDB);

export const DiscountBannerRoutes = router;
