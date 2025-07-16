import { Router } from 'express';
import { CareerController } from './career.controller';

const router = Router();

router.get('/', CareerController.getAllFromDB);
router.get('/frontend', CareerController.getAllForFrontend);
router.get('/:id', CareerController.getByIdFromDB);
router.post('/add', CareerController.insertIntoDB);
router.patch('/:id', CareerController.updateOneInDB);
router.delete('/:id', CareerController.deleteByIdFromDB);

export const CareerRoutes = router;
