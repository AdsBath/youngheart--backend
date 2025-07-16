import { Router } from 'express';
import { BannerController } from './banner.controller';

const router = Router();

router.get('/', BannerController.getAllFromDB);
router.get('/:id', BannerController.getByIdFromDB);
router.post('/add', BannerController.insertIntoDB);
router.patch('/:id', BannerController.updateOneInDB);
router.delete('/:id', BannerController.deleteByIdFromDB);

export const BannerRoutes = router;
