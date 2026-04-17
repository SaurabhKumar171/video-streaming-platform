const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Routes
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");

// Observability Config
const logger = require("./config/logger");
const {
  register,
  httpRequestDurationMicroseconds,
} = require("./config/metrics");

const app = express();

// --- 1. OBSERVABILITY LAYER (Must be first) ---
app.use((req, res, next) => {
  const start = Date.now();

  // Initialize with 'anonymous'.
  // If 'protect' middleware runs later, this gets updated to the real orgId.
  req.log = logger.child({ organizationId: "anonymous" });

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    // Track Latency & Traffic (Golden Signals)
    // We use req.route?.path to avoid high cardinality in Prometheus
    const route = req.route ? req.baseUrl + req.route.path : req.path;

    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode)
      .observe(duration);

    // Structured Log (Errors & Traffic)
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}s`,
    };

    if (res.statusCode >= 400) {
      req.log.warn(logData, "Request failed");
    } else {
      req.log.info(logData, "HTTP Request Completed");
    }
  });

  next();
});

// --- 2. METRICS ENDPOINT ---
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// --- 3. STANDARD MIDDLEWARE ---
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

// --- 4. STATIC FILES ---
app.use(
  "/thumbnails",
  express.static(path.join(__dirname, "..", "uploads", "thumbnails")),
);
app.use(
  "/processed",
  express.static(path.join(__dirname, "..", "uploads", "processed")),
);

// --- 5. VERSIONED ROUTES ---
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);

// --- 6. ERROR HANDLING ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
