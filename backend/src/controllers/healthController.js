const mongoose = require("mongoose");
const { cloudinary } = require("../config/cloudinary");

exports.livenessCheck = (req, res) => {
  return res.status(200).json({
    status: "ALIVE",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "Video stream Platform",
  });
};

exports.readinessCheck = async (req, res) => {
  try {
    // 1. Check MongoDB
    const dbState = mongoose.connection.readyState;
    const isDBConnected = dbState === 1; // 1 = connected

    // 2. Check Cloudinary (lightweight API ping)
    let isCloudinaryConnected = false;

    try {
      await cloudinary.api.ping();
      isCloudinaryConnected = true;
    } catch (err) {
      isCloudinaryConnected = false;
    }

    // Final readiness decision
    if (isDBConnected && isCloudinaryConnected) {
      return res.status(200).json({
        status: "READY",
        services: {
          database: "UP",
          cloudinary: "UP",
        },
      });
    } else {
      return res.status(503).json({
        status: "NOT_READY",
        services: {
          database: isDBConnected ? "UP" : "DOWN",
          cloudinary: isCloudinaryConnected ? "UP" : "DOWN",
        },
      });
    }
  } catch (error) {
    return res.status(503).json({
      status: "NOT_READY",
      error: error.message,
    });
  }
};
