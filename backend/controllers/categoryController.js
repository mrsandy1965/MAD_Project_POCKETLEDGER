const { prisma } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const DEFAULT_CATEGORIES = [
  { name: 'Food', type: 'expense' },
  { name: 'Travel', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Bills', type: 'expense' },
  { name: 'Salary', type: 'income' },
  { name: 'Business', type: 'income' },
  { name: 'Misc', type: 'general' },
];

const ensureDefaultCategories = async () => {
  await Promise.all(
    DEFAULT_CATEGORIES.map(async (category) => {
      const existing = await prisma.category.findFirst({
        where: { name: category.name, isDefault: true },
      });

      if (!existing) {
        await prisma.category.create({
          data: { ...category, isDefault: true },
        });
      }
    })
  );
};

const getCategories = async (req, res) => {
  try {
    await ensureDefaultCategories();

    const categories = await prisma.category.findMany({
      where: {
        OR: [{ isDefault: true }, { userId: req.user.id }],
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(res, { categories });
  } catch (error) {
    console.error('Get categories error:', error.message);
    return errorResponse(res, 'Unable to fetch categories');
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, type = 'general' } = req.body;

    if (!name) {
      return errorResponse(res, 'Category name is required', 400);
    }

    const existing = await prisma.category.findFirst({
      where: { name, userId: req.user.id },
    });

    if (existing) {
      return errorResponse(res, 'Category already exists', 409);
    }

    const category = await prisma.category.create({
      data: { name, type, userId: req.user.id },
    });

    return successResponse(res, { category }, 'Category created', 201);
  } catch (error) {
    console.error('Create category error:', error.message);
    return errorResponse(res, 'Unable to create category');
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;

    const category = await prisma.category.findFirst({
      where: { id, userId: req.user.id, isDefault: false },
    });

    if (!category) {
      return errorResponse(res, 'Category not found or cannot be updated', 404);
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(type ? { type } : {}),
      },
    });

    return successResponse(res, { category: updated }, 'Category updated');
  } catch (error) {
    console.error('Update category error:', error.message);
    return errorResponse(res, 'Unable to update category');
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { id, userId: req.user.id, isDefault: false },
    });

    if (!category) {
      return errorResponse(res, 'Category not found or cannot be deleted', 404);
    }

    await prisma.category.delete({ where: { id } });

    return successResponse(res, { id }, 'Category deleted');
  } catch (error) {
    console.error('Delete category error:', error.message);
    return errorResponse(res, 'Unable to delete category');
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
