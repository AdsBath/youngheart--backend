import { Router } from 'express';
import { ProductProductCollectionController } from './productProductCollection.controler';

const router = Router();

router.get('/', ProductProductCollectionController.getAllFromDB);

export const ProductProductCollectionRoutes = router;
