import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();

router.get('/', ProductController.getAllFromDB);
router.get('/product-collection', ProductController.getProductsByCollection);
router.get('/offer-product', ProductController.getOfferProduct);
router.get('/all-offer-product', ProductController.getAllOfferProduct);

router.get('/:id', ProductController.getByIdFromDB);
router.get('/get/:slug', ProductController.getProductByIdFromDB);
router.get(
  '/related-product/:categoryId',
  ProductController.getRelatedProductFromDB,
);
router.post('/add', ProductController.insertIntoDB);
router.patch('/:id', ProductController.updateOneInDB);
router.delete('/delete/:id', ProductController.deleteByIdFromDB);
router.delete('/all/delete-many', ProductController.deleteMultiple);

export const ProductRoutes = router;
