// class مخصص للأخطاء
// بدل ما نكرر res.status(404).json({...}) بكل مكان

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
  }

  // ─────────────────────────────
  // Static methods جاهزة للاستخدام السريع
  // ─────────────────────────────
  static badRequest(message = "Bad Request") {
    return new ApiError(400, message);
  }

  static notFound(message = "Not Found") {
    return new ApiError(404, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static conflict(message = "Already Exists") {
    return new ApiError(409, message);
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
