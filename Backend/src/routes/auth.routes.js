const express = require("express");
const router = express.Router();
const { validateRegister, validateLogin } = require("../middleware/validateAuth");
const { authenticate } = require("../middleware/auth");
const { register, login, refresh, getMe } = require("../controllers/auth.controller");

// POST /api/auth/register
router.post("/register", validateRegister, register);

// POST /api/auth/login
router.post("/login", validateLogin, login);

// POST /api/auth/refresh
router.post("/refresh", refresh);

// GET /api/auth/me
router.get("/me", authenticate, getMe);

module.exports = router;
