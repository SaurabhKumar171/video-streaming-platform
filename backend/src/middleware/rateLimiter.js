const { RateLimiterRedis } = require("rate-limiter-flexible");
const connection = require("../config/redis");
const logger = require("../config/logger");

// Configure: 10 uploads per hour per Organization
const uploadLimiter = new RateLimiterRedis({
  storeClient: connection,
  keyPrefix: "rl_org_upload",
  points: 10, // Number of uploads allowed
  duration: 3600, // Per hour (in seconds)
  blockDuration: 600, // If they hit the limit, block for 10 minutes
});

const orgRateLimitMiddleware = async (req, res, next) => {
  // Ensure req.user exists (must be placed after your 'protect' middleware)
  const orgId = req.user.organizationId;

  if (!orgId) {
    return res
      .status(403)
      .json({ message: "Organization ID missing from token." });
  }

  try {
    // Consume 1 point for the organization
    await uploadLimiter.consume(orgId.toString());
    next();
  } catch (rejRes) {
    // Calculate wait time
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;

    res.set({
      "Retry-After": secs,
      "X-RateLimit-Limit": 10,
      "X-RateLimit-Remaining": 0,
      "X-RateLimit-Reset": new Date(
        Date.now() + rejRes.msBeforeNext,
      ).toISOString(),
    });

    logger.warn({
      msg: "Organization Rate Limit Tripped",
      orgId: req.user.organizationId,
      userId: req.user.id,
    });

    res.status(429).json({
      success: false,
      message: `Organization quota exceeded. Try again in ${Math.round(secs / 60)} minutes.`,
    });
  }
};

module.exports = { orgRateLimitMiddleware };
