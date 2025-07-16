import { Router } from 'express';
import { AbandonCartController } from './abandonedCart.controller';

const router = Router();

router.get('/', AbandonCartController.getAllFromDB);
router.get('/:id', AbandonCartController.getByIdFromDB);
router.post('/add', AbandonCartController.insertIntoDB);
router.delete('/:id', AbandonCartController.deleteByIdFromDB);

export const AbandonedCartRoutes = router;
