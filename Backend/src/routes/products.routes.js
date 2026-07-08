const express = require("express");
const router = express.Router();
const { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } = require("../controllers/products.controller");
const { authenticate, authorize } = require("../middleware/auth");

// GET /api/products?category=&search=&sort=&page=&limit=
router.get("/", getAllProducts);

router.post("/", authenticate, authorize("ADMIN"), createProduct);

router.get("/:slug", getProductBySlug);

router.put("/:id", authenticate, authorize("ADMIN"), updateProduct);

router.delete("/:id", authenticate, authorize("ADMIN"), deleteProduct);

module.exports = router;
