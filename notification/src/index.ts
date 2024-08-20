import http from "http";
import { app } from "./app";
import { connectDBWithRetry } from "./config/db/mongodb";
import logger from "./config/winston/logger";

const server = http.createServer(app);

const PORT = process.env.PORT || 8002;

// create server
server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  connectDBWithRetry();
});

// Graceful shutdown
const shutdown = () => {
  logger.info("Shutting down server...");
  server.close(() => {
    logger.info("Server terminated gracefully");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
