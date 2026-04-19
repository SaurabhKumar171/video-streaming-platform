const express = require("express");
const router = express.Router();
// const multer = require("multer");
// const path = require("path");
const { upload } = require("../config/cloudinary");
const {
  uploadVideo,
  getVideos,
  streamVideo,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("viewer", "editor", "admin"), getVideos);
router.get(
  "/stream/:id",
  protect,
  authorize("viewer", "editor", "admin"),
  streamVideo,
);

router.post(
  "/upload",
  protect,
  authorize("editor", "admin"),
  upload.single("video"),
  uploadVideo,
);

router.put("/:id", protect, authorize("admin", "editor"), updateVideo);

router.delete("/:id", protect, authorize("admin", "editor"), deleteVideo);

module.exports = router;
