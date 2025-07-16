import { Router } from 'express';
import { ApplicationController } from './application.controller';

const router = Router();

router.get('/', ApplicationController.getAllFromDB);
router.get('/:id', ApplicationController.getByIdFromDB);
router.post('/add', ApplicationController.insertIntoDB);
router.patch('/:id', ApplicationController.updateOneInDB);
router.delete('/:id', ApplicationController.deleteByIdFromDB);

export const ApplicationRoutes = router;
