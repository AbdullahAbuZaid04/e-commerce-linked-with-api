// ─── src/utils/jwt.js ───
// توليد والتحقق من Access و Refresh Tokens

const jwt = require("jsonwebtoken");

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_EXPIRES_IN  = "15m"; // عمر قصير — يُستخدم في كل طلب
const REFRESH_EXPIRES_IN = "7d";  // عمر طويل — يُستخدم لتجديد الـ Access فقط

// ─── Access Token ────────────────────────────────────────
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    return null;
  }
}

// ─── Refresh Token ───────────────────────────────────────
function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
