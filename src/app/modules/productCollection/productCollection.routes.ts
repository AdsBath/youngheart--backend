import { Router } from 'express';
import { ProductCollectionController } from './productCollection.controller';

const router = Router();

router.get('/', ProductCollectionController.getAllFromDB);
router.get('/:id', ProductCollectionController.getByIdFromDB);
router.post('/', ProductCollectionController.insertIntoDB);
router.patch('/:id', ProductCollectionController.updateOneInDB);
router.delete('/:id', ProductCollectionController.deleteByIdFromDB);
router.delete(
  '/delete/delete-many',
  ProductCollectionController.deleteMultipleData,
);

export const ProductCollectionRoutes = router;
