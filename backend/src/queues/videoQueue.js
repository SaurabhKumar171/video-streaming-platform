const { Queue } = require("bullmq");
const connection = require("../config/redis");
const { QUEUES } = require("../config/constants");

// Define the queue name
const VIDEO_QUEUE = QUEUES.VIDEO;

const videoQueue = new Queue(VIDEO_QUEUE, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // Wait 5s, then 10s, then 20s...
    },
    removeOnComplete: true, // Keep Redis clean
  },
});

module.exports = { videoQueue, VIDEO_QUEUE };
