import { Router } from 'express';
import { CustomDesignController } from './customDesign.controller';

const router = Router();

router.get('/', CustomDesignController.getAllFromDB);
router.get('/:id', CustomDesignController.getByIdFromDB);
router.post('/add', CustomDesignController.insertIntoDB);
router.patch('/:id', CustomDesignController.updateOneInDB);
router.delete('/:id', CustomDesignController.deleteByIdFromDB);

export const CustomDesignRoutes = router;
