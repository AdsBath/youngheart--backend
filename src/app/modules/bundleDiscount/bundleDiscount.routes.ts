import { Router } from 'express';
import { BundleDiscountController } from './bundleDiscount.controller';

const router = Router();

router.get('/', BundleDiscountController.getAllFromDB);
router.get('/:id', BundleDiscountController.getByIdFromDB);
router.post('/add', BundleDiscountController.insertIntoDB);
router.patch('/:id', BundleDiscountController.updateOneInDB);
router.delete('/:id', BundleDiscountController.deleteByIdFromDB);
router.delete(
  '/delete/delete-many',
  BundleDiscountController.deleteMultipleData,
);

export const BundleDiscountRoutes = router;
