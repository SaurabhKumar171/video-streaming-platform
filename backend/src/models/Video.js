const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    filename: { type: String, required: false },
    videoUrl: { type: String, required: true }, // The main Cloudinary URL
    thumbnail: { type: String }, // Auto-generated JPG from Cloudinary
    cloudinaryId: { type: String },
    mimetype: { type: String },
    size: { type: Number },
    category: {
      type: String,
      enum: ["tutorial", "meeting", "marketing"],
      default: "tutorial",
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    sensitivityScore: { type: Number, default: 0 }, // 0 to 100
    isFlagged: { type: Boolean, default: false },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    streams: {
      "720p": String,
      "480p": String,
      "360p": String,
      original: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Video", VideoSchema);
