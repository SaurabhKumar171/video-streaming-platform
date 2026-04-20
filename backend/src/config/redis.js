const Redis = require("ioredis");
const logger = require("./logger");

let connection;

if (process.env.REDIS_URL) {
  // --- Production/Cloud (Upstash) ---
  connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    // Upstash/Cloud stability settings
    tls: {
      rejectUnauthorized: false, // Helps avoid resets on some cloud providers
    },
    connectTimeout: 10000, // 10 seconds
  });
} else {
  // --- Local Development ---
  connection = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
  });
}

connection.on("error", (err) => {
  // We use logger.error so we see exactly why the reset happens
  logger.error({ err }, "Redis Connection Error");
});

connection.on("connect", () => {
  logger.info("Successfully connected to Redis");
});

module.exports = connection;
