import { Router } from 'express';
import { AddressController } from './address.controller';

const router = Router();

router.get('/', AddressController.getAllFromDB);
router.get('/:id', AddressController.getByIdFromDB);
router.post('/add', AddressController.insertIntoDB);
router.patch('/:id', AddressController.updateOneInDB);
router.delete('/:id', AddressController.deleteByIdFromDB);

export const AddressRoutes = router;
