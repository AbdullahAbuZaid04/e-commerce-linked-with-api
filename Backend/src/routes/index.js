const express = require("express");
const router = express.Router();

const productRoutes = require("./products.routes");
const categoryRoutes = require("./categories.routes");
const orderRoutes = require("./orders.routes");
const authRoutes = require("./auth.routes");
const userRoutes = require("./users.routes");
const uploadRoutes = require("./upload.routes");

// Route mappings
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/uploads", uploadRoutes);

module.exports = router;
