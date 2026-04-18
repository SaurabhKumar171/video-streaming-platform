const mongoose = require("mongoose");
const logger = require("../config/logger");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      logger.error({ msg: "MONGO_URI is not defined in environment" });
      process.exit(1);
    }

    logger.info({
      msg: "MONGO_URI status",
      status: "FOUND",
    });

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.info({
      msg: "MongoDB Connected",
      host: conn.connection.host,
      dbName: conn.connection.name,
    });
  } catch (error) {
    logger.error({
      msg: "Database connection failed",
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};

module.exports = connectDB;
