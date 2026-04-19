require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");
const app = require("./src/app"); // Import the configured app
const socketHandler = require("./src/sockets/socketMain");
const logger = require("./src/config/logger");
const { createAdapter } = require("@socket.io/redis-adapter");
const connection = require("./src/config/redis");

// 1. Connect to Database
connectDB();

// 2. Create HTTP Server
const server = http.createServer(app);

// 3. Setup WebSockets
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }, // Use specific origin for cookies
});

// --- Redis Adapter ---
// We need two clients: one to publish, one to subscribe
const pubClient = connection;
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
// -------------------------------------

// 4. Initialize Modular Sockets
app.set("socketio", io);
socketHandler(io);

// 5. Start Listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
