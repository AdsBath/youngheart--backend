import { Router } from 'express';
import { InventoryController } from './inventory.controller';

const router = Router();

router.get('/', InventoryController.getAllFromDB);
router.get('/:id', InventoryController.getDataByIdFromDB);
router.post('/add', InventoryController.insertIntoDb);
router.get('/inventory-note/:id', InventoryController.getInventoryNoteById);
router.post('/inventory-note/add', InventoryController.createInventoryNote);
router.patch('/inventory-note/:id', InventoryController.updateInventoryNote);
router.patch('/:id', InventoryController.updateByIdFromDB);
router.delete('/:id', InventoryController.deleteByIdFromDB);

export const InventoryRoutes = router;
