// توحيد شكل الـ response
// كل responses بنفس الشكل

class ApiResponse {
  static success(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static created(res, data) {
    return res.status(201).json({
      success: true,
      data,
    });
  }

  static paginated(res, data, pagination) {
    return res.status(200).json({
      success: true,
      data,
      pagination,
    });
  }

  static message(res, message, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
    });
  }
}

module.exports = ApiResponse;

