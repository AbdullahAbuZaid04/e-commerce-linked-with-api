// ─── src/utils/hash.js ───
// تشفير والتحقق من كلمات المرور باستخدام bcrypt

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; // معيار الصناعة — توازن بين الأمان والسرعة

// تشفير كلمة المرور (يُستخدم في Register)
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// التحقق من كلمة المرور (يُستخدم في Login)
// يرجع true أو false
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, comparePassword };
