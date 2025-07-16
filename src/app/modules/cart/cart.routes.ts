import { Router } from 'express';
import { CartController } from './cart.controller';

const router = Router();

router.get('/', CartController.getAllFromDB);
router.get('/:id', CartController.getByIdFromDB);

router.post('/add', CartController.insertIntoDB);
router.post('/increment', CartController.incrementQuantity);
router.post('/decrement', CartController.decrementQuantity);

router.patch('/:id', CartController.updateOneInDB);
router.delete('/:id', CartController.deleteByIdFromDB);
router.delete('/item/:id', CartController.deleteCartItem);

export const CartRoutes = router;
