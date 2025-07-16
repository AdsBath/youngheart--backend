import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const allCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.allCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Categories data fetched successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories data fetched successfully',
    data: result,
  });
});

const getCategoriesForFooter = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.getCategoriesForFooter();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Footer Categories data fetched successfully',
      data: result,
    });
  },
);

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CategoryService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category data fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CategoryService.updateOneInDB(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category data updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CategoryService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category data deleted successfully',
    data: result,
  });
});

const getTopLabelCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.getTopLabelCategories();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Top label categories fetched successfully',
      data: result,
    });
  },
);

const getFeaturedCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.getFeaturedCategories();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Featured categories fetched successfully!',
      data: result,
    });
  },
);

const getMenuCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getMenuCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Menu categories fetched successfully!',
    data: result,
  });
});

const getElementorCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.getElementorCategories();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Elementor categories fetched successfully!',
      data: result,
    });
  },
);

const getOneBySlugFromDB = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await CategoryService.getOneBySlugFromDB(
    slug.split(',').slice(-1)[0],
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category data fetched successfully by slug',
    data: result,
  });
});

const filterCategoryWithProducts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.filterCategoryWithProducts();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Filter category fetched successfully',
      data: result,
    });
  },
);

export const CategoryController = {
  insertIntoDB,
  getAllCategories,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getTopLabelCategories,
  getFeaturedCategories,
  getElementorCategories,
  getMenuCategories,
  getOneBySlugFromDB,
  getCategoriesForFooter,
  filterCategoryWithProducts,
  allCategories,
};
