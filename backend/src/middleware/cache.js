const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => console.error("Redis Error:", err));
client.connect();

const cacheMiddleware = (duration) => async (req, res, next) => {
  const key = `__express__${req.user.organizationId}${req.originalUrl || req.url}`;

  try {
    const cachedResponse = await client.get(key);

    if (cachedResponse) {
      res.setHeader("X-Cache", "HIT");
      return res.json(JSON.parse(cachedResponse));
    } else {
      res.sendResponse = res.json;
      res.json = (body) => {
        client.setEx(key, duration, JSON.stringify(body));
        res.setHeader("X-Cache", "MISS");
        res.sendResponse(body);
      };
      next();
    }
  } catch (error) {
    next();
  }
};

module.exports = cacheMiddleware;
