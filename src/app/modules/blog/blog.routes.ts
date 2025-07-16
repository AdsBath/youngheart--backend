import { Router } from 'express';
import { BlogController } from './blog.controller';

const router = Router();

router.get('/', BlogController.getAllFromDB);
router.get('/frontend', BlogController.getAllForFrontend);
router.get('/:id', BlogController.getByIdFromDB);
router.get('/get/:slug', BlogController.getBySlugFromDB);
router.post('/add', BlogController.insertIntoDB);
router.patch('/:id', BlogController.updateOneInDB);
router.delete('/:id', BlogController.deleteByIdFromDB);

export const BlogRoutes = router;
