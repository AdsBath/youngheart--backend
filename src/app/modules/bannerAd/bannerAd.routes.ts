import { Router } from 'express';
import { BannerAdController } from './bannerAd.controller';

const router = Router();

router.get('/', BannerAdController.getAllFromDB);
router.get('/frontend', BannerAdController.getAllForFrontend);
router.get('/:id', BannerAdController.getByIdFromDB);
router.post('/add', BannerAdController.insertIntoDB);
router.patch('/:id', BannerAdController.updateOneInDB);
router.delete('/:id', BannerAdController.deleteByIdFromDB);

export const BannerAdRoutes = router;
