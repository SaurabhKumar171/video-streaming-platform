const client = require("prom-client");

// Create a Registry
const register = new client.Registry();

// Add default metrics (CPU, Memory, etc.)
client.collectDefaultMetrics({
  register,
  prefix: "video_platform_",
});

// Custom Metric: HTTP Request Duration
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

register.registerMetric(httpRequestDurationMicroseconds);

module.exports = { register, httpRequestDurationMicroseconds };
