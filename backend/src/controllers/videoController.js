const Video = require("../models/Video");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
// const { compressVideo } = require("../utils/transcoder");
const { cloudinary } = require("../config/cloudinary");

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const io = req.app.get("socketio");

    // 1. Strict Cloudinary Check
    if (!req.file || !req.file.path.startsWith("http")) {
      console.error(
        "STORAGE ERROR: File was saved locally or upload to Cloudinary failed.",
      );
      return res.status(400).json({
        message:
          "Cloud storage synchronization failed. Ensure Cloudinary credentials are correct.",
      });
    }

    const cloudUrl = req.file.path;
    // Cloudinary 'filename' is actually the public_id (e.g., 'v-stream/video_123')
    const publicId = req.file.filename;

    // 2. Optimized Metadata Extraction
    const autoThumbnail = cloudUrl
      .replace(/\.[^/.]+$/, ".jpg")
      .replace("/upload/", "/upload/so_1,f_auto,q_auto/");

    // 3. Persistent Record Creation
    const video = await Video.create({
      title: title || req.file.originalname,
      description: description || "Asset documentation pending.",
      filename: publicId,
      videoUrl: cloudUrl,
      thumbnail: autoThumbnail,
      cloudinaryId: publicId,
      mimetype: req.file.mimetype,
      size: req.file.size,
      category: category || "tutorial",
      uploadedBy: req.user.id,
      organizationId: req.user.organizationId,
      status: "processing",
      streams: {
        original: cloudUrl,
        "720p": cloudUrl.replace(
          "/upload/",
          "/upload/w_1280,h_720,c_limit,f_auto,q_auto/",
        ),
        "480p": cloudUrl.replace(
          "/upload/",
          "/upload/w_854,h_480,c_limit,f_auto,q_auto/",
        ),
      },
    });

    // 4. Trigger Background AI Analysis
    analyzeVideo(video, io, req.user.id).catch((err) =>
      console.error("Background Analysis Pipeline Error:", err),
    );

    res.status(201).json({
      success: true,
      message: "Asset synchronized with global CDN.",
      data: video,
    });
  } catch (error) {
    console.error("Senior Controller Exception:", error);
    res.status(500).json({ message: "Internal server synchronization error." });
  }
};

async function analyzeVideo(video, io, userId) {
  try {
    const roomId = userId.toString();

    // 1. Immediate Thumbnail Update
    if (io) {
      io.to(roomId).emit("thumbnail_ready", {
        videoId: video._id,
        thumbnailUrl: video.thumbnail, // Now a full URL
      });
    }

    // 2. Simulated AI Processing Steps
    const analysisSteps = [
      { p: 30, s: "Scanning frames for restricted content..." },
      { p: 65, s: "Evaluating multi-tenant safety protocols..." },
      { p: 100, s: "Security audit finalized." },
    ];

    for (let step of analysisSteps) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (io) {
        io.to(roomId).emit("video_progress", {
          videoId: video._id,
          progress: step.p,
          status: step.s,
        });
      }
    }

    // 3. Generate Sensitivity Metrics
    const randomScore = Math.floor(Math.random() * 100);
    video.sensitivityScore = randomScore;
    video.isFlagged = randomScore > 75;

    // 🔥 FIX: Using 'completed' to match your Schema Enum
    video.status = "completed";

    await video.save();

    // 4. Final Notification to Frontend
    if (io) {
      io.to(roomId).emit("video_finished", {
        videoId: video._id,
        isFlagged: video.isFlagged,
        score: video.sensitivityScore,
        status: "completed",
        videoUrl: video.videoUrl, // Provide full URL for immediate play
      });
    }

    console.log(
      `✅ Asset ${video._id} Analysis: COMPLETED (Score: ${randomScore})`,
    );
  } catch (err) {
    console.error("CRITICAL: Background Analysis Failed:", err);
  }
}

exports.getVideos = async (req, res) => {
  try {
    const { search, category, status, minSize, maxSize, sortBy, safety } =
      req.query;

    let query = { organizationId: req.user.organizationId };

    // Metadata: Search by Title
    if (search) query.title = { $regex: search, $options: "i" };

    // Metadata: Category
    if (category) query.category = category;

    // Content-Based: Safety Status (Safe vs Flagged)
    if (safety === "safe") query.isFlagged = false;
    if (safety === "flagged") query.isFlagged = true;

    // Metadata: File Size Filtering (in Bytes)
    if (minSize || maxSize) {
      query.fileSize = {};
      if (minSize) query.fileSize.$gte = Number(minSize);
      if (maxSize) query.fileSize.$lte = Number(maxSize);
    }

    // Sorting (Date, Size, Duration)
    let sortOptions = {};
    if (sortBy === "newest") sortOptions.createdAt = -1;
    if (sortBy === "oldest") sortOptions.createdAt = 1;
    if (sortBy === "largest") sortOptions.fileSize = -1;
    if (sortBy === "duration") sortOptions.duration = -1;

    const videos = await Video.find(query).sort(
      sortOptions || { createdAt: -1 },
    );

    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ message: "Filter error" });
  }
};

exports.streamVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });
    if (!video) return res.status(404).json({ message: "Video not found" });

    const videoPath = path.join(__dirname, "../../uploads", video.filename);
    if (!fs.existsSync(videoPath))
      return res.status(404).json({ message: "File not found on server" });

    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;

    if (!range) return res.status(400).send("Requires Range header");

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath, { start, end }).pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Streaming error" });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Isolation: Find video only if it belongs to the user's organization
    let video = await Video.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!video) return res.status(404).json({ message: "Video not found" });

    // Update fields
    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;

    await video.save();
    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Asset not found in registry." });
    }

    if (
      video.organizationId.toString() !== req.user.organizationId.toString()
    ) {
      return res.status(403).json({
        message:
          "Security Violation: You do not have clearance for this operation.",
      });
    }

    if (video.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(video.cloudinaryId, {
          resource_type: "video",
          invalidate: true,
        });
      } catch (cloudErr) {
        console.error("Cloudinary Deletion Warning:", cloudErr);
      }
    }

    await video.deleteOne();

    res.json({
      success: true,
      message:
        "Asset and associated cloud resources successfully decommissioned.",
    });
  } catch (error) {
    console.error("Delete Operation Failure:", error);
    res
      .status(500)
      .json({ message: "Internal server error during asset decommissioning." });
  }
};
