// ─── src/middleware/errorHandler.js ───
// Error Handler مركزي — يمسك كل الأخطاء غير المتوقعة
// بما فيها أخطاء Prisma الشائعة

function errorHandler(err, req, res, next) {
  console.error("❌ خطأ:", err.message);

  // Prisma: Unique constraint (مثال: إيميل مكرر)
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      error: "هذه القيمة مسجلة مسبقاً",
    });
  }

  // Prisma: Record not found (update/delete على سجل غير موجود)
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      error: "السجل غير موجود",
    });
  }

  res.status(err.statusCode || err.status || 500).json({
    success: false,
    error: err.message || "خطأ داخلي في السيرفر",
  });
}

module.exports = errorHandler;
