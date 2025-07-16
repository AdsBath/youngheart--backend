import { Router } from 'express';
import { ShippingRulesController } from './shippingRules.controller';

const router = Router();

router.get('/', ShippingRulesController.getAllFromDB);
router.get('/:id', ShippingRulesController.getByIdFromDB);
router.post('/add', ShippingRulesController.insertIntoDB);
router.patch('/:id', ShippingRulesController.updateOneInDB);
router.delete('/:id', ShippingRulesController.deleteByIdFromDB);
router.delete('/delete/delete-many', ShippingRulesController.deleteMultiple);

export const ShippingRulesRoutes = router;
