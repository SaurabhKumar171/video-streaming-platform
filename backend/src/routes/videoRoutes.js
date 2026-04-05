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

// Fix: Multer Storage Engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     // Keeps original extension: 1712345678-myvideo.mp4
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

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
