import { Request, Response, NextFunction } from "express";
import Prometheus from "prom-client";
import logger from "../winston/logger";

// Initialize Prometheus Registry
const register = new Prometheus.Registry();

// Collect default metrics and register them
Prometheus.collectDefaultMetrics({ register });

// Define metrics
const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
  registers: [register],
});

const httpRequestsTotal = new Prometheus.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "code"],
  registers: [register],
});

const httpRequestsErrorTotal = new Prometheus.Counter({
  name: "http_requests_error_total",
  help: "Total number of HTTP requests resulting in an error response",
  labelNames: ["method", "route", "code"],
  registers: [register],
});

const concurrentConnectionsGauge = new Prometheus.Gauge({
  name: "concurrent_connections",
  help: "Number of concurrent connections",
  registers: [register],
});

const memoryUsageGauge = new Prometheus.Gauge({
  name: "memory_usage_bytes",
  help: "Amount of memory used by the application in bytes",
  registers: [register],
});

const cpuUsageGauge = new Prometheus.Gauge({
  name: "cpu_usage_seconds",
  help: "Amount of CPU time used by the application in seconds",
  registers: [register],
});

const networkTrafficTotal = new Prometheus.Counter({
  name: "network_traffic_total_bytes",
  help: "Total network traffic in bytes",
  registers: [register],
});

// Middleware to track metrics
function trackMetrics(req: Request, res: Response, next: NextFunction) {
  // Set start time for request duration calculation
  res.locals.startEpoch = Date.now();

  // Track memory usage
  const memoryUsageInBytes = process.memoryUsage().rss;
  memoryUsageGauge.set(memoryUsageInBytes);

  // Track CPU usage
  const cpuUsageInSeconds = process.cpuUsage().user / 1000000; // convert to seconds
  cpuUsageGauge.set(cpuUsageInSeconds);

  next();
}

function requestMetricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Track concurrent connections
  concurrentConnectionsGauge.inc();

  // Track network traffic
  req.on("data", (chunk: Buffer | string) => {
    if (typeof chunk === "string") {
      networkTrafficTotal.inc(Buffer.byteLength(chunk, "utf8"));
    } else {
      networkTrafficTotal.inc(chunk.length);
    }
  });

  res.on("finish", () => {
    concurrentConnectionsGauge.dec();

    const responseTimeInMs = Date.now() - (res.locals.startEpoch as number);

    httpRequestDurationMicroseconds
      .labels(req.method, req.originalUrl, res.statusCode.toString())
      .observe(responseTimeInMs);

    httpRequestsTotal
      .labels(req.method, req.originalUrl, res.statusCode.toString())
      .inc();

    if (res.statusCode && res.statusCode >= 400) {
      httpRequestsErrorTotal
        .labels(req.method, req.originalUrl, res.statusCode.toString())
        .inc();
    }

    const contentLength =
      parseInt(res.getHeader("Content-Length") as string, 10) || 0;
    networkTrafficTotal.inc(contentLength);
  });

  next();
}

function metricsEndpoint(req: Request, res: Response) {
  try {
    res.set("Content-Type", register.contentType);
    res.send(register.metrics());
  } catch (error) {
    logger.error("Error in metricsEndpoint:", error);
    res.status(500).send("Internal Server Error");
  }
}
export { requestMetricsMiddleware, trackMetrics, metricsEndpoint, register };
