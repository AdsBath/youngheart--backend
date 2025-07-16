import { Router } from 'express';
import { PageController } from './page.controller';

const router = Router();

router.get('/', PageController.getAllFromDB);
router.get('/frontend', PageController.getAllForFrontend);
router.get('/:id', PageController.getByIdFromDB);
router.post('/add', PageController.insertIntoDB);
router.patch('/:id', PageController.updateOneInDB);
router.delete('/:id', PageController.deleteByIdFromDB);

export const PageRoutes = router;
