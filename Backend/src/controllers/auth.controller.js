const prisma = require("../lib/prisma");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  });

  if (existingUser) {
    throw ApiError.conflict("البريد الإلكتروني مسجل بالفعل");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "CUSTOMER"
    }
  });

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  ApiResponse.created(res, { user: userData, accessToken, refreshToken });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  });

  if (!user) {
    throw ApiError.unauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  ApiResponse.success(res, { user: userData, accessToken, refreshToken });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw ApiError.badRequest("يجب توفير Refresh Token");
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw ApiError.unauthorized("Refresh Token منتهي أو غير صالح");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!user) {
    throw ApiError.notFound("المستخدم غير موجود");
  }

  const newAccessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

  ApiResponse.success(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (!user) {
    throw ApiError.notFound("المستخدم غير موجود");
  }

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  ApiResponse.success(res, userData);
});

module.exports = {
  register,
  login,
  refresh,
  getMe
};
