import { Router } from 'express';
import { BrandController } from './brand.controller';

const router = Router();

router.get('/', BrandController.getAllFromDB);
router.get('/:id', BrandController.getByIdFromDB);
router.post('/', BrandController.insertIntoDB);
router.patch('/:id', BrandController.updateOneInDB);
router.delete('/:id', BrandController.deleteByIdFromDB);
router.delete('/delete/delete-many', BrandController.deleteMultipleData);

export const BrandRoutes = router;
