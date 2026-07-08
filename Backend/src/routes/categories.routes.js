const express = require("express");
const router = express.Router();
const { createCategory, getAllCategories, getOneCategory, updateCategory, deleteCategory } = require("../controllers/categories.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/", authenticate, authorize("ADMIN"), createCategory);

router.get("/", getAllCategories);

router.get("/:slug", getOneCategory);

router.put("/:id", authenticate, authorize("ADMIN"), updateCategory);

router.delete("/:id", authenticate, authorize("ADMIN"), deleteCategory);

module.exports = router;
