const prisma = require("../lib/prisma");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  ApiResponse.success(res, users);
});

const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw ApiError.notFound("المستخدم غير موجود");

  ApiResponse.success(res, user);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !["CUSTOMER", "ADMIN"].includes(role)) {
    throw ApiError.badRequest("الدور يجب أن يكون CUSTOMER أو ADMIN");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound("المستخدم غير موجود");

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  ApiResponse.success(res, updated);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound("المستخدم غير موجود");

  if (user.role === "ADMIN") {
    throw ApiError.badRequest("لا يمكن حذف مستخدم بصلاحية مدير");
  }

  await prisma.user.delete({ where: { id } });

  ApiResponse.message(res, "تم حذف المستخدم بنجاح");
});

module.exports = {
  getAllUsers,
  getOneUser,
  updateUserRole,
  deleteUser,
};
