// ─── src/middleware/validateAuth.js ───
// Validation لبيانات التسجيل والدخول

function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "name, email, password مطلوبة",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "صيغة الإيميل غير صحيحة",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
    });
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({
      success: false,
      error: "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل",
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "email و password مطلوبان",
    });
  }

  next();
}

module.exports = { validateRegister, validateLogin };
