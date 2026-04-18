const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const logger = require("../config/logger");

module.exports = (io) => {
  io.use((socket, next) => {
    try {
      const headerCookie = socket.handshake.headers.cookie;
      const cookies = headerCookie ? cookie.parse(headerCookie) : {};

      // Check for token in cookies or auth object (Postman/Mobile)
      const token = cookies.token || socket.handshake.auth.token;

      if (!token) return next(new Error("Unauthorized: No token provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;

      next();
    } catch (err) {
      logger.error({
        msg: "Socket Auth Error",
        message: err.message,
        stack: err.stack,
      });

      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    socket.join(userId.toString());
    logger.info(`User ${userId} connected to private room`);

    socket.on("disconnect", () => {
      logger.info(`User ${userId} disconnected`);
    });
  });
};
