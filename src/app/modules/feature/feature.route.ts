import { Router } from 'express';
import { FeatureController } from './feature.controller';

const router = Router();

router.get('/', FeatureController.getAllFromDB);
router.get('/:id', FeatureController.getByIdFromDB);
router.post('/', FeatureController.insertIntoDB);
router.patch('/:id', FeatureController.updateOneInDB);
router.delete('/:id', FeatureController.deleteByIdFromDB);

export const FeatureRoutes = router;
