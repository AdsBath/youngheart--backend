import { Router } from 'express';
import { OrderNotificationController } from './orderNotification.controller';

const router = Router();

router.get('/', OrderNotificationController.getAllNotifications);
router.get('/:userId', OrderNotificationController.getUserNotification);
router.patch('/read', OrderNotificationController.markAsRead);

export const OrderNotificationRoutes = router;
