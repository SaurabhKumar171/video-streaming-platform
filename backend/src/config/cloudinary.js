const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const CircuitBreaker = require("opossum");
const logger = require("./logger");

// 1. Link your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. The "Dangerous" Action: Uploading to an external service
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "v-stream-portal",
        resource_type: "video",
        // Re-adding your eager transformations for the breaker
        eager: [
          { width: 1280, height: 720, crop: "limit", format: "mp4" },
          { width: 854, height: 480, crop: "limit", format: "mp4" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });
};

// 2. Configure the Breaker
const options = {
  timeout: 60000, // Wait 60s for video upload
  errorThresholdPercentage: 50, // Trip if 50% requests fail
  resetTimeout: 30000, // Wait 30s before trying again
};

const cloudinaryBreaker = new CircuitBreaker(uploadToCloudinary, options);

// 3. Resilience Logging
cloudinaryBreaker.on("open", () =>
  logger.error("CIRCUIT BREAKER OPEN: Cloudinary is down/slow."),
);
cloudinaryBreaker.on("halfOpen", () =>
  logger.info("CIRCUIT BREAKER HALF-OPEN: Testing Cloudinary..."),
);
cloudinaryBreaker.on("close", () =>
  logger.info("CIRCUIT BREAKER CLOSED: Cloudinary is healthy."),
);

// 4. Multer Memory Storage (Crucial for Phase 3)
const upload = multer({
  storage: multer.memoryStorage(), // Use RAM instead of direct cloud storage
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = { cloudinary, upload, cloudinaryBreaker };
