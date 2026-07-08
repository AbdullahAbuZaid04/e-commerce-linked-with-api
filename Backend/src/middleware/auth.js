// ─── src/middleware/auth.js ───
// يتحقق من وجود Access Token صالح في الـ Header
// ويضع بياناته في req.user للاستخدام في باقي الـ Route

const { verifyAccessToken } = require("../utils/jwt");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "لازم تسجّل دخول أولاً",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: "Token منتهي أو غير صالح",
      code: "TOKEN_EXPIRED", // يساعد الفرونت يعرف يستخدم /refresh
    });
  }

  // الآن متاح في كل Route بعد هذا الـ Middleware:
  // req.user.id, req.user.email, req.user.role
  req.user = decoded;
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "لازم تسجّل دخول أولاً",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "غير مصرح لك بالوصول لهذا المسار",
      });
    }

    next();
  };
}

module.exports = { authenticate, authorize };
