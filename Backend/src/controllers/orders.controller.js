const prisma = require("../lib/prisma");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingName, shippingPhone, shippingAddress } = req.body;

  // Validation أساسي
  if (!Array.isArray(items) || items.length === 0) {
    throw ApiError.badRequest("السلة فاضية");
  }
  if (!shippingName?.trim() || !shippingPhone?.trim() || !shippingAddress?.trim()) {
    throw ApiError.badRequest("بيانات الشحن غير مكتملة");
  }

  const productIds = items.map((i) => i.productId);

  if (productIds.length !== new Set(productIds).size) {
    throw ApiError.badRequest("يوجد تكرار في بعض المنتجات بالسلة");
  }

  // كل شيء جوا transaction واحدة — لو فشل أي جزء، يترجع كل شيء (لا يبقى order ناقص أو stock مخصوم غلط)
  const order = await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    if (productMap.size !== productIds.length) {
      throw ApiError.badRequest("بعض المنتجات غير موجودة أو محذوفة");
    }

    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      const quantity = Number(item.quantity);

      if (!quantity || quantity <= 0) {
        throw ApiError.badRequest(`كمية غير صحيحة لمنتج: ${product.name}`);
      }
      if (product.stock < quantity) {
        throw ApiError.badRequest(
          `الكمية المتوفرة من "${product.name}" غير كافية (متوفر: ${product.stock})`
        );
      }

      const price = Number(product.price); // ← من الداتابيز، نقطة الأمان الأساسية
      total += price * quantity;

      orderItemsData.push({
        productId: product.id,
        quantity,
        price, // نخزن السعر وقت الشراء، مش نعتمد على سعر المنتج الحالي مستقبلاً
      });
    }

    const createdOrder = await tx.order.create({
      data: {
        total,
        userId: req.user.id, // ربط الطلب بالملف الشخصي للمستخدم
        shippingName: shippingName.trim(),
        shippingPhone: shippingPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        items: { create: orderItemsData },
      },
      include: { items: { include: { product: true } } },
    });

    // خصم المخزون — كل تحديث جوا نفس الـ transaction
    for (const item of orderItemsData) {
      const product = productMap.get(item.productId);
      const newStock = product.stock - item.quantity;

      const updated = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } }, // ← شرط أمان إضافي ضد race condition
        data: {
          stock: { decrement: item.quantity },
          ...(newStock === 0 && { isPublished: false }), // إلغاء النشر تلقائياً إذا أصبح المخزون صفراً
        },
      });
      if (updated.count === 0) {
        throw ApiError.badRequest("نفذت الكمية من أحد المنتجات، حاول مرة أخرى");
      }
    }

    return createdOrder;
  });

  ApiResponse.created(res, order);
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    throw ApiError.notFound("الطلب غير موجود");
  }

  // التحقق من الملكية: الآدمن يرى كل الطلبات، والمستخدم يرى طلباته فقط
  if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
    throw ApiError.forbidden("غير مصرح لك بمشاهدة هذا الطلب");
  }

  ApiResponse.success(res, order);
});

const ORDER_STATUS_FLOW = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [], // حالة نهائية
  CANCELLED: [], // حالة نهائية
};

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status: newStatus } = req.body;

  if (!Object.keys(ORDER_STATUS_FLOW).includes(newStatus)) {
    throw ApiError.badRequest("حالة غير صحيحة");
  }

  const order = await prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!existingOrder) {
      throw ApiError.notFound("الطلب غير موجود");
    }

    if (existingOrder.status === newStatus) {
      return existingOrder;
    }

    // منع الانتقالات غير المنطقية (مثلاً DELIVERED -> PENDING)
    const allowedNext = ORDER_STATUS_FLOW[existingOrder.status];
    if (!allowedNext.includes(newStatus)) {
      throw ApiError.badRequest(
        `لا يمكن تغيير الحالة من ${existingOrder.status} إلى ${newStatus}`
      );
    }

    // النقطة الحرجة: استرجاع المخزون عند الإلغاء
    if (newStatus === "CANCELLED") {
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return tx.order.update({
      where: { id },
      data: { status: newStatus },
      include: { items: { include: { product: true } } },
    });
  });

  ApiResponse.success(res, order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = "1", limit = "20" } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const where = status ? { status } : {};

  // إذا لم يكن آدمن، يتم جلب طلبات المستخدم الحالي فقط
  if (req.user.role !== "ADMIN") {
    where.userId = req.user.id;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      include: { items: { include: { product: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  ApiResponse.paginated(res, orders, {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum),
  });
});

module.exports = { createOrder, getOrderById, getAllOrders, updateOrderStatus };