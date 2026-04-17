const pino = require("pino");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  // In production, we keep JSON. In development, we can use pino-pretty.
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty" }
      : undefined,
});

module.exports = logger;
