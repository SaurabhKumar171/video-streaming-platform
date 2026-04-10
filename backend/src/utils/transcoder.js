// const Video = require("../models/Video");
// const path = require("path");
// const fs = require("fs");
// const ffmpeg = require("fluent-ffmpeg");
// const ffmpegPath = require("ffmpeg-static");

// ffmpeg.setFfmpegPath(ffmpegPath);

// exports.compressVideo = async (filename, io, userId, videoId) => {
//   const inputPath = path.join(__dirname, "../../uploads", filename);
//   const videoName = filename.split(".")[0];
//   const outputDir = path.join(__dirname, "../../uploads/processed", videoName);

//   // Ensure output directory exists
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   const qualities = [
//     { res: "1280x720", name: "720p", bitrate: "2500k" },
//     { res: "854x480", name: "480p", bitrate: "1000k" },
//   ];

//   // Map each quality to a Promise so we can track completion
//   const processingPromises = qualities.map((q) => {
//     return new Promise((resolve, reject) => {
//       const outputPath = path.join(outputDir, `${q.name}.mp4`);

//       ffmpeg(inputPath)
//         .size(q.res)
//         .videoBitrate(q.bitrate)
//         .output(outputPath) // Explicitly set output path
//         .on("start", () => {
//           console.log(`Started processing ${q.name} for ${filename}`);
//         })
//         .on("end", async () => {
//           // Update DB for this specific quality
//           await Video.findByIdAndUpdate(videoId, {
//             $set: { [`streams.${q.name}`]: `${videoName}/${q.name}.mp4` },
//           });

//           io.to(userId.toString()).emit("video_status", {
//             videoId,
//             msg: `${q.name} version is ready!`,
//             quality: q.name,
//           });

//           resolve();
//         })
//         .on("error", (err) => {
//           console.error(`Error processing ${q.name}:`, err.message);
//           reject(err);
//         })
//         .run(); // Start the command
//     });
//   });

//   try {
//     // Wait for ALL qualities to finish before updating final status
//     await Promise.all(processingPromises);

//     await Video.findByIdAndUpdate(videoId, { status: "completed" });

//     io.to(userId.toString()).emit("video_status", {
//       videoId,
//       status: "completed",
//       msg: "All quality levels processed successfully!",
//     });

//     console.log(`Finished all transcoding for ${filename}`);
//   } catch (error) {
//     await Video.findByIdAndUpdate(videoId, { status: "failed" });
//     console.error("Transcoding pipeline failed:", error);
//   }
// };
