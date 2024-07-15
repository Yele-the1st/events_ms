import http from "http";
import { app } from "./app";
import { connectDB } from "./config/db/mongodb";
import logger from "./config/winston/logger";

const server = http.createServer(app);

const PORT = process.env.PORT || 8001;

// create server
server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

// Graceful shutdown
process.on("SIGTERM", () => {
  server.close(() => {
    logger.info("Server terminated gracefully");
    process.exit(0);
  });
});
