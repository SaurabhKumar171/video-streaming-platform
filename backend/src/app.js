const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

// Standard Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Replace with your frontend URL
    // origin: "https://video-streaming-platform-sable.vercel.app",
    credentials: true, // Allows cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(
  "/thumbnails",
  express.static(path.join(__dirname, "..", "uploads", "thumbnails")),
);
app.use(
  "/processed",
  express.static(path.join(__dirname, "..", "uploads", "processed")),
);

// Versioned Modular Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
