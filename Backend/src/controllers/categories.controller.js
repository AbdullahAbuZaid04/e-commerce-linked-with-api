const prisma = require("../lib/prisma");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { generateSlug } = require("../utils/helpers");

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    throw ApiError.badRequest("الاسم مطلوب");
  }

  const slug = generateSlug(name);

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { name: name.trim() },
        { slug }
      ]
    }
  });

  if (existingCategory) {
    throw ApiError.conflict("التصنيف موجود مسبقاً");
  }

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug
    }
  });

  ApiResponse.created(res, category);
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "asc"
    }
  });

  ApiResponse.success(res, categories);
});

const getOneCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await prisma.category.findUnique({
    where: {
      slug
    },
    include: {
      products: {
        where: { isPublished: true }
      }
    }
  });

  if (!category) {
    throw ApiError.notFound("التصنيف غير موجود");
  }

  ApiResponse.success(res, category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name?.trim()) {
    throw ApiError.badRequest("الاسم مطلوب");
  }

  const category = await prisma.category.findUnique({
    where: {
      id
    }
  });

  if (!category) {
    throw ApiError.notFound("التصنيف غير موجود");
  }

  const newSlug = generateSlug(name);

  const duplicate = await prisma.category.findFirst({
    where: {
      id: {
        not: id
      },
      OR: [
        { name: { equals: name.trim(), mode: "insensitive" } },
        { slug: newSlug }
      ]
    }
  });

  if (duplicate) {
    throw ApiError.conflict("التصنيف موجود مسبقاً");
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id
    },
    data: {
      name: name.trim(),
      slug: newSlug
    }
  });

  ApiResponse.success(res, updatedCategory);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw ApiError.notFound("التصنيف غير موجود");
  }

  const productsCount = await prisma.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    throw ApiError.badRequest(
      `لا يمكن حذف التصنيف لأنه يحتوي على ${productsCount} منتج. يرجى نقلهم أو حذفهم أولاً.`
    );
  }

  await prisma.category.delete({ where: { id } });
  ApiResponse.message(res, "تم حذف التصنيف بنجاح");
});

module.exports = {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
};