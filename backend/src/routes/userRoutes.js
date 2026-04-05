const express = require("express");
const router = express.Router();
const {
  getTenantUsers,
  updateContent,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

// Admin only
router.get("/", protect, authorize("admin"), getTenantUsers);

// Admin only
router.delete("/:id", protect, authorize("admin"), deleteUser);

// Admin and Editor
// router.post("/edit", protect, authorize("admin", "editor"), updateContent);

module.exports = router;
