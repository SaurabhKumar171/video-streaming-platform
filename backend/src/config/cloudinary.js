const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

require("dotenv").config();

// 1. Link your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define the Cloudinary Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "v-stream-portal",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "mkv"],
    eager: [
      { width: 1280, height: 720, crop: "limit", format: "mp4" },
      { width: 854, height: 480, crop: "limit", format: "mp4" },
    ],
    eager_async: true,
    transformation: [{ fetch_format: "auto", quality: "auto" }],
    public_id: (req, file) =>
      `video_${Date.now()}_${file.originalname.split(".")[0]}`,
  },
});

// 3. Initialize Multer with the CLOUDINARY engine
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

module.exports = { cloudinary, upload };
