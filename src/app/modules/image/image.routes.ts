import { Router } from 'express';
import { deleteImage } from './image.controller';

const router = Router();

router.delete('/:publicId', deleteImage);

export const ImageRoutes = router;
