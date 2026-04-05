const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

const cors = require("cors");

const allowedOrigins = [
  "https://video-stream-app-frontend.netlify.app", // Your Netlify URL
  "http://localhost:5173", // For local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // MANDATORY: This matches your frontend 'withCredentials'
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Standard Middleware
// app.use(
//   cors({
//     origin: "*", // Replace with your frontend URL
//     credentials: true, // Allows cookies to be sent
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );
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
