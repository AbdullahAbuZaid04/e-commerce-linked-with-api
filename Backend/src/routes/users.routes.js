const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getOneUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/users.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate, authorize("ADMIN"));

router.get("/", getAllUsers);
router.get("/:id", getOneUser);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;
