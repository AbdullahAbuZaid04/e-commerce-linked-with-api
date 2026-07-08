/**
 * Express asyncHandler utility to eliminate try-catch boilerplate in controllers.
 * Passes any rejected promise/error to the next middleware (error handler).
 * 
 * @param {Function} fn - Async express route handler/middleware
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
