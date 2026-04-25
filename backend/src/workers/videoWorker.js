require("dotenv").config();

const { Worker } = require("bullmq");
const { Emitter } = require("@socket.io/redis-emitter");
const connection = require("../config/redis");
const logger = require("../config/logger");
const Video = require("../models/Video");
const connectDB = require("../config/db");
const { QUEUES } = require("../config/constants");

const io = new Emitter(connection);

const startWorker = async () => {
  // Force the process to wait for DB connection
  await connectDB();
  logger.info("Worker DB Connection Verified");

  const videoWorker = new Worker(
    QUEUES.VIDEO,
    async (job) => {
      const { videoId, userId, organizationId } = job.data;
      const roomId = userId.toString();
      const workerLog = logger.child({
        videoId,
        jobId: job.id,
        organizationId,
      });

      try {
        workerLog.info("Starting analysis task");

        const video = await Video.findById(videoId);
        if (!video) throw new Error("Video not found");

        // --- IDEMPOTENCY GATEKEEPER ---
        // If a retry happens but the DB already shows completion, stop immediately.
        if (video.status === "completed") {
          workerLog.info(
            "Job already processed in previous attempt. Skipping.",
          );
          return { skipped: true, reason: "already_completed" };
        }

        // Simulated AI Steps
        const analysisSteps = [
          { p: 30, s: "Scanning frames..." },
          { p: 65, s: "Evaluating safety protocols..." },
          { p: 100, s: "Security audit finalized." },
        ];

        for (let step of analysisSteps) {
          await new Promise((res) => setTimeout(res, 1500));

          // Update progress in Redis/Job metadata
          await job.updateProgress(step.p);
          workerLog.info({ progress: step.p }, step.s);

          // Emit socket message here using a Redis Emitter
          io.to(roomId).emit("video_progress", {
            videoId,
            progress: step.p,
            status: step.s,
          });
        }

        // Finalize Logic
        const randomScore = Math.floor(Math.random() * 100);
        video.sensitivityScore = randomScore;
        video.isFlagged = randomScore > 75;
        video.status = "completed";

        await video.save();
        workerLog.info("Analysis complete");
      } catch (err) {
        workerLog.error(err, "Worker process failed");
        throw err; // BullMQ will handle the retry
      }
    },
    { connection },
  );
};

startWorker();
