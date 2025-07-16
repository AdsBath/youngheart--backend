import { Router } from 'express';
import { AttributeController } from './attribute.controller';

const router = Router();

router.get('/', AttributeController.getAllFromDB);
router.get('/:id', AttributeController.getByIdFromDB);
router.post('/add', AttributeController.insertIntoDB);
router.patch('/:id', AttributeController.updateOneInDB);
router.delete('/:id', AttributeController.deleteByIdFromDB);

export const AttributeRoutes = router;
