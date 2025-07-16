import { Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

router.get('/', OrderController.getAllFromDB);
router.get('/get-my-order', OrderController.getMyOrder);
router.get('/order-overview', OrderController.oderOverview);
router.get('/order-analytics', OrderController.orderAnalytics);
router.get('/order-monthly-data', OrderController.getDailyDataForMonth);
router.get('/top-ten-category', OrderController.getTopTenCategories);
router.get('/top-ten-products', OrderController.getTopTenProducts);
router.get('/my-order/:orderId', OrderController.getMyOrderByIdFromDB);
router.get('/:id', OrderController.getByIdFromDB);
router.post('/add', OrderController.insertIntoDB);
router.patch('/update-status/:id', OrderController.updateOrderStatus);
router.patch('/:id', OrderController.updateOneInDB);
router.delete('/:id', OrderController.deleteByIdFromDB);
router.delete('/delete/delete-many', OrderController.deleteMultipleData);

export const OrderRoutes = router;
