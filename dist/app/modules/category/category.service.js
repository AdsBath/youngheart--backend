"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateSlug_1 = __importDefault(require("../../../utils/generateSlug"));
const insertIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, generateSlug_1.default)(data.title);
    data.slug = slug;
    const { parentId = null } = data, categoryData = __rest(data, ["parentId"]);
    try {
        let category;
        if (parentId) {
            // Check if the parent category exists
            const parentCategory = yield prisma_1.default.category.findUnique({
                where: { id: parentId },
            });
            if (!parentCategory) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Parent category not found!');
            }
            // Create subcategory
            category = yield prisma_1.default.category.create({
                data: Object.assign(Object.assign({}, categoryData), { parentId }),
            });
        }
        else {
            // Create category
            category = yield prisma_1.default.category.create({
                data: Object.assign(Object.assign({}, categoryData), { parentId: null }),
            });
        }
        return category;
    }
    catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
    finally {
        yield prisma_1.default.$disconnect();
    }
});
const allCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
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
    const total = yield prisma_1.default.category.count({
        where: {
            status: true,
            OR: [{ parentId: null }, { parentId: { not: null } }],
        },
    });
    return { total, data: result };
});
const buildChildrenInclude = (depth) => {
    if (depth <= 0)
        return false; // Stop recursion after reaching the desired depth
    return {
        children: {
            include: buildChildrenInclude(depth - 1),
        },
        products: {
            orderBy: { createdAt: 'desc' },
        },
    };
};
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
        where: {
            parentId: null,
        },
        orderBy: {
            createdAt: 'asc',
        },
        include: buildChildrenInclude(10), // Dynamically include nested children
    });
    const total = yield prisma_1.default.category.count({});
    return {
        total: total,
        data: result,
    };
});
const getTopLabelCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
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
    const total = yield prisma_1.default.category.count({
        where: { parentId: null },
    });
    return {
        total: total,
        data: result,
    };
});
const getElementorCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
        where: { status: true, elementor: true },
        orderBy: {
            createdAt: 'asc',
        },
    });
    const total = yield prisma_1.default.category.count({
        where: { featured: true },
    });
    return {
        total: total,
        data: result,
    };
});
const getFeaturedCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
        where: { status: true, featured: true },
        orderBy: {
            createdAt: 'asc',
        },
    });
    // console.log(result);
    const total = yield prisma_1.default.category.count({
        where: { status: true, featured: true },
    });
    return {
        total: total,
        data: result,
    };
});
const getMenuCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
        where: { status: true },
        orderBy: {
            createdAt: 'asc',
        },
        include: {
            children: true,
        },
    });
    const total = yield prisma_1.default.category.count({
        where: { status: true },
    });
    return {
        total: total,
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
        include: {
            children: true,
            parent: true,
        },
    });
    return result;
});
const filterCategoryWithProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
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
        const totalProductsLength = parentProductsLength +
            childrenWithProducts.reduce((sum, child) => sum + child.productsLength, 0);
        return {
            title: category.title,
            slug: category.slug,
            productsLength: totalProductsLength, // Total products length from parent and children
            children: childrenWithProducts, // Include filtered children
        };
    });
    // Filter out categories with no children that have products
    return filteredCategories.filter(category => category.children.length > 0 || category.productsLength > 0);
});
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
const getOneBySlugFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    // Helper function to recursively fetch categories and their products
    const fetchCategoryWithChildren = (categorySlug) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield prisma_1.default.category.findUnique({
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
        const allChildren = yield Promise.all(category.children.map((child) => __awaiter(void 0, void 0, void 0, function* () {
            const nestedChild = yield fetchCategoryWithChildren(child.slug); // Recursive call
            return nestedChild;
        })));
        // Flatten the children into a single array
        const flattenedChildren = allChildren.flat();
        return Object.assign(Object.assign({}, category), { children: flattenedChildren });
    });
    // Start the recursive fetching from the provided slug
    const category = yield fetchCategoryWithChildren(slug);
    if (!category) {
        return { category: null, products: [] }; // Return null category and empty products array if not found
    }
    // Helper function to collect all products from category and nested children
    const collectProducts = (category) => {
        const products = [];
        // Add products from the current category
        if (category.products) {
            products.push(...category.products);
        }
        // Recursively add products from children
        if (category.children) {
            category.children.forEach((child) => {
                products.push(...collectProducts(child));
            });
        }
        return products;
    };
    // Collect all products from the category tree
    const products = collectProducts(category);
    return { category, products }; // Return the category and accumulated products
});
const getCategoriesForFooter = () => __awaiter(void 0, void 0, void 0, function* () {
    const allCategories = yield prisma_1.default.category.findMany({
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
});
const updateOneInDB = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCategory = yield prisma_1.default.category.update({
            where: { id },
            data: payload,
        });
        return updatedCategory;
    }
    catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
    finally {
        yield prisma_1.default.$disconnect();
    }
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield prisma_1.default.category.findUnique({
        where: { id },
    });
    if (!existingCategory) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
    }
    // Delete the category
    yield prisma_1.default.category.delete({
        where: { id },
    });
    return { message: 'Category deleted successfully' };
});
exports.CategoryService = {
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
