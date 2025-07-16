import { Router } from 'express';
import { AttributeItemController } from './attributeItem.controller';

const router = Router();

router.get('/', AttributeItemController.getAllFromDB);
router.get('/:id', AttributeItemController.getByIdFromDB);
router.post('/add', AttributeItemController.insertIntoDB);
router.patch('/:id', AttributeItemController.updateOneInDB);
router.delete('/:id', AttributeItemController.deleteByIdFromDB);
router.delete('/delete/delete-many', AttributeItemController.deleteMultiple);

export const AttributeItemRoutes = router;
