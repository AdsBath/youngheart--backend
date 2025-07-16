import { Router } from 'express';
import { CartItemController } from './cartItem.controller';

const router = Router();

router.post('/increment', CartItemController.incrementQuantity);
router.post('/decrement', CartItemController.decrementQuantity);

export const CartItemRoutes = router;
