import { Router } from 'express';
import { WishlistController } from './wishlist.controller';

const router = Router();

router.get('/my-wishlist/:userId', WishlistController.getMyWishlistFromDB);
router.get('/:id', WishlistController.getByIdFromDB);
router.post('/add', WishlistController.insertIntoDB);
router.patch('/:id', WishlistController.updateOneInDB);
router.delete('/:id', WishlistController.deleteByIdFromDB);

export const WishlistRoutes = router;
