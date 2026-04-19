const Redis = require("ioredis");
const logger = require("./logger");
const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // BullMQ requirement
};

const connection = new Redis(redisConfig);

connection.on("error", (err) => {
  logger.error("Redis Connection Error:", err);
});

module.exports = connection;
