import { Category, Product } from '@prisma/client';
import httpStatus from 'http-status';

import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import generateSlug from '../../../utils/generateSlug';

const insertIntoDb = async (data: any) => {
  const slug = generateSlug(data.title);
  data.slug = slug;
  const { parentId = null, ...categoryData } = data;

  try {
    let category;
    if (parentId) {
      // Check if the parent category exists
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Parent category not found!');
      }

      // Create subcategory
      category = await prisma.category.create({
        data: {
          ...categoryData,
          parentId,
        },
      });
    } else {
      // Create category
      category = await prisma.category.create({
        data: {
          ...categoryData,
          parentId: null,
        },
      });
    }
    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const allCategories = async () => {
  const result = await prisma.category.findMany({
    where: {
      AND: {
        OR: [{ parentId: null }, { parentId: { not: null } }],
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      parent: true,
      products: true,
    },
  });

  const total = await prisma.category.count({
    where: {
      status: true,
      OR: [{ parentId: null }, { parentId: { not: null } }],
    },
  });
  return { total, data: result };
};

const buildChildrenInclude = (depth: number): any => {
  if (depth <= 0) return false; // Stop recursion after reaching the desired depth
  return {
    children: {
      include: buildChildrenInclude(depth - 1),
    },
    products: {
      orderBy: { createdAt: 'desc' },
    },
  };
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: buildChildrenInclude(10), // Dynamically include nested children
  });

  const total = await prisma.category.count({});
  return {
    total: total,
    data: result,
  };
};

const getTopLabelCategories = async () => {
  const result = await prisma.category.findMany({
    where: { parentId: null, status: true },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: true,
                },
              },
            },
          },
        },
      },
      products: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const total = await prisma.category.count({
    where: { parentId: null },
  });

  return {
    total: total,
    data: result,
  };
};

const getElementorCategories = async () => {
  const result = await prisma.category.findMany({
    where: { status: true, elementor: true },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const total = await prisma.category.count({
    where: { featured: true },
  });

  return {
    total: total,
    data: result,
  };
};

const getFeaturedCategories = async () => {
  const result = await prisma.category.findMany({
    where: { status: true, featured: true },
    orderBy: {
      createdAt: 'asc',
    },
  });
  // console.log(result);

  const total = await prisma.category.count({
    where: { status: true, featured: true },
  });

  return {
    total: total,
    data: result,
  };
};

const getMenuCategories = async (): Promise<any> => {
  const result = await prisma.category.findMany({
    where: { status: true },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      children: true,
    },
  });

  const total = await prisma.category.count({
    where: { status: true },
  });

  return {
    total: total,
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      children: true,
      parent: true,
    },
  });
  return result;
};

const filterCategoryWithProducts = async () => {
  const categories = await prisma.category.findMany({
    where: {
      AND: [
        { status: true },
        { parent: null }, // Only get top-level categories
      ],
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      products: {
        orderBy: { createdAt: 'desc' },
      }, // Include products for parent categories
      children: {
        include: {
          products: true, // Include products for child categories
        },
      },
    },
  });

  // Map to get the desired structure for parent categories with their children
  const filteredCategories = categories.map(category => {
    // Calculate the total number of products in the parent category
    const parentProductsLength = category.products.length;

    // Filter and map children categories with their products
    const childrenWithProducts = category.children
      .filter(child => child.products.length > 0) // Only keep children with products
      .map(child => ({
        title: child.title,
        slug: child.slug,
        productsLength: child.products.length, // Count of products in this child category
      }));

    // Calculate the total products length including children
    const totalProductsLength =
      parentProductsLength +
      childrenWithProducts.reduce(
        (sum, child) => sum + child.productsLength,
        0,
      );

    return {
      title: category.title,
      slug: category.slug,
      productsLength: totalProductsLength, // Total products length from parent and children
      children: childrenWithProducts, // Include filtered children
    };
  });

  // Filter out categories with no children that have products
  return filteredCategories.filter(
    category => category.children.length > 0 || category.productsLength > 0,
  );
};

// const getOneBySlugFromDB = async (
//   slug: string,
// ): Promise<CategoryWithProducts> => {
//   const category = await prisma.category.findUnique({
//     where: { slug },
//     include: {
//       children: {
//         include: {
//           products: true,
//         },
//       },
//       products: true,
//     },
//   });

//   if (!category) {
//     return { category: null, products: [] }; // Return null category and empty products array if not found
//   }

//   // Collect products from the parent category and its children
//   const products: Product[] = [];

//   // Add products from the parent category
//   if (category.products) {
//     products.push(...category.products);
//   }

//   // Add products from the children categories
//   if (category.children) {
//     category.children.forEach(child => {
//       if (child.products) {
//         products.push(...child.products);
//       }
//     });
//   }

//   return { category, products }; // Return category data along with the products
// };

const getOneBySlugFromDB = async (
  slug: string,
): Promise<{ category: any; products: Product[] }> => {
  // Helper function to recursively fetch categories and their products
  const fetchCategoryWithChildren = async (
    categorySlug: string,
  ): Promise<any> => {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        children: {
          include: {
            children: true, // Includes only one level of children for now
          },
        },
        products: {
          orderBy: { createdAt: 'desc' },
          include: {
            bundleDiscount: true,
          },
        },
      },
    });

    if (!category) {
      return null;
    }

    // Recursively fetch nested children and their products up to 7 levels
    const allChildren = await Promise.all(
      category.children.map(async child => {
        const nestedChild = await fetchCategoryWithChildren(child.slug); // Recursive call
        return nestedChild;
      }),
    );

    // Flatten the children into a single array
    const flattenedChildren = allChildren.flat();

    return {
      ...category,
      children: flattenedChildren,
    };
  };

  // Start the recursive fetching from the provided slug
  const category = await fetchCategoryWithChildren(slug);

  if (!category) {
    return { category: null, products: [] }; // Return null category and empty products array if not found
  }

  // Helper function to collect all products from category and nested children
  const collectProducts = (category: any): Product[] => {
    const products: Product[] = [];

    // Add products from the current category
    if (category.products) {
      products.push(...category.products);
    }

    // Recursively add products from children
    if (category.children) {
      category.children.forEach((child: any) => {
        products.push(...collectProducts(child));
      });
    }

    return products;
  };

  // Collect all products from the category tree
  const products = collectProducts(category);

  return { category, products }; // Return the category and accumulated products
};

const getCategoriesForFooter = async (): Promise<Category[] | null> => {
  const allCategories = await prisma.category.findMany({
    where: {
      status: true,
      featured: true,
    },
  });

  if (allCategories.length <= 5) {
    return allCategories;
  }

  const shuffledCategories = allCategories.sort(() => 0.5 - Math.random());
  const selectedCategories = shuffledCategories.slice(0, 5);

  return selectedCategories;
};

const updateOneInDB = async (
  payload: Category,
  id: string,
): Promise<Category> => {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: payload,
    });
    return updatedCategory;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const deleteByIdFromDB = async (id: string): Promise<any> => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // Delete the category
  await prisma.category.delete({
    where: { id },
  });

  return { message: 'Category deleted successfully' };
};

export const CategoryService = {
  insertIntoDb,
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
