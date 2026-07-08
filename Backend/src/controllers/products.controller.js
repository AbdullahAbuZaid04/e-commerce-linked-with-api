const prisma = require("../lib/prisma");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { generateSlug, serialize } = require("../utils/helpers");

const ALLOWED_SORTS = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  name_asc: { name: "asc" },
};

const getAllProducts = asyncHandler(async (req, res) => {
    const { category, search, sort, page = "1", limit = "12" } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

    // تصحيح: استخدام مصفوفة AND لضمان دمج الشروط بأمان
    const where = {
      AND: [
        { isPublished: true } // الشرط الأساسي دائم التحقق
      ]
    };

    // فلترة التصنيف
    if (category) {
      where.AND.push({
        category: { slug: category }
      });
    }

    // فلترة البحث (مدمجة داخل الـ AND لضمان عدم تخطي شرط النشر وقسم المنتج)
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ]
      });
    }

    const orderBy = ALLOWED_SORTS[sort] || ALLOWED_SORTS.newest;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          images: true,
          stock: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }),
      prisma.product.count({ where }),
    ]);

    const serializedProducts = serialize(products);

    ApiResponse.paginated(res, serializedProducts, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
});


const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: { category: true },
  });

  if (!product) {
    throw ApiError.notFound("المنتج غير موجود")
  }

  const productData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    images: product.images,
    stock: product.stock,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug
    },
    createdAt: product.createdAt,
  };

  ApiResponse.success(res, productData);
});


const createProduct = asyncHandler(async (req, res) => {
  const {name,description,price,images,stock,categoryId} = req.body
  if (!name || !description || !price || !images || !categoryId) {
    throw ApiError.badRequest("البيانات غير صحيحة")
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    throw ApiError.badRequest("اسم المنتج يجب أن يكون على الأقل حرفين")
  }

  const parsedPrice = Number(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    throw ApiError.badRequest("السعر يجب أن يكون رقماً موجباً")
  }

  if (stock !== undefined) {
    const parsedStock = Number(stock);
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      throw ApiError.badRequest("المخزون يجب أن يكون عدداً صحيحاً غير سالب")
    }
  }

  const slug = generateSlug(name);

  const existingCategory = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  })

  if (!existingCategory) {
    throw ApiError.notFound("التصنيف غير موجود")
  }
  
  const existingProduct = await prisma.product.findFirst({
    where: {
      OR: [
        { name: name.trim() },
        { slug }
      ]
    }
  })

  if (existingProduct) {
    throw ApiError.conflict("المنتج موجود مسبقاً")
  }

  const productData = {
    name,
    slug,
    description,
    price: Number(price),
    images,
    stock: Number(stock),
    categoryId,
    isPublished: Number(stock) > 0 ? true : false,
  }

  const product = await prisma.product.create({data: productData})

  ApiResponse.created(res, product);

})


const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, images, stock, categoryId } = req.body;

  const slug = name ? generateSlug(name) : undefined;

  const updateData = {
    ...(name && { name }),
    ...(description && { description }),
    ...(price !== undefined && { price: Number(price) }),
    ...(images && { images }),
    ...(stock !== undefined && { stock: Number(stock) }),
    ...(categoryId && { categoryId }),
    ...(slug && { slug }),
    // Always recalculate isPublished based on stock
    isPublished: stock !== undefined ? Number(stock) > 0 : undefined,
  };

  // Validate that at least one field is being updated
  if (Object.keys(updateData).length === 0) {
    throw ApiError.badRequest("لا توجد بيانات للتحديث");
  }

  if (price !== undefined) {
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw ApiError.badRequest("السعر يجب أن يكون رقماً موجباً");
    }
  }

  if (stock !== undefined) {
    const parsedStock = Number(stock);
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      throw ApiError.badRequest("المخزون يجب أن يكون عدداً صحيحاً غير سالب");
    }
  }

  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
    throw ApiError.badRequest("اسم المنتج يجب أن يكون على الأقل حرفين");
  }

  // Validate category if it's being updated
  if (categoryId) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!existingCategory) {
      throw ApiError.notFound("التصنيف غير موجود");
    }
  }

  // Check for duplicate product name or slug (excluding current product)
  if (slug) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { name: updateData.name },
              { slug: updateData.slug },
            ]
          }
        ]
      }
    });
    if (existingProduct) {
      throw ApiError.conflict("المنتج موجود مسبقاً");
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  ApiResponse.success(res, updatedProduct);
});


const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw ApiError.notFound("المنتج غير موجود");
  }

  // Optional: Check if product is in any orders before deleting
  const orderItems = await prisma.orderItem.findMany({
    where: { productId: id }
  });

  if (orderItems.length > 0) {
    // Option 1: Don't allow deletion if product is in orders
    //throw ApiError.badRequest("لا يمكن حذف المنتج لأنه موجود في طلبات سابقة. يرجى التعامل معه أولاً.");

    // Option 2: Archive instead of permanent deletion
    await prisma.product.update({
      where: { id },
      data: { isPublished: false, stock: 0 }
    });
    return ApiResponse.message(res, "تم أرشفة المنتج بنجاح (لا يمكن حذفه لأنه مرتبط بطلبات)");
  }

  await prisma.product.delete({
    where: { id }
  });

  ApiResponse.message(res, "تم حذف المنتج بنجاح");
});


module.exports = {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
