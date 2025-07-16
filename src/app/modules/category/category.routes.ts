import { Router } from 'express';
import { CategoryController } from './category.controller';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/all-categories', CategoryController.allCategories);
router.get('/top-labels', CategoryController.getTopLabelCategories);
router.get('/featured', CategoryController.getFeaturedCategories);
router.get('/filter-category', CategoryController.filterCategoryWithProducts);
router.get('/footer-category', CategoryController.getCategoriesForFooter);
router.get('/elementor', CategoryController.getElementorCategories);
router.get('/menu', CategoryController.getMenuCategories);
router.get('/:id', CategoryController.getByIdFromDB);
router.get('/slug/:slug', CategoryController.getOneBySlugFromDB);
router.post('/', CategoryController.insertIntoDB);
router.patch('/:id', CategoryController.updateOneInDB);
router.delete('/:id', CategoryController.deleteByIdFromDB);

export const CategoryRoutes = router;
