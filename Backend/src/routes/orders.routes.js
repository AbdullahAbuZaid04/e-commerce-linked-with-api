const express = require("express");
const router = express.Router();
const { createOrder, getOrderById, getAllOrders, updateOrderStatus } = require("../controllers/orders.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getAllOrders);
router.get("/:id", authenticate, getOrderById);
router.patch("/:id/status", authenticate, authorize("ADMIN"), updateOrderStatus);

module.exports = router;