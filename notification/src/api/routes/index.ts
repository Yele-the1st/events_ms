import express, { Request, Response } from "express";

import { metricsEndpoint } from "../../config/prometheus/metrics";
import deliveryRoutes from "./deliveryRoutes";
import templateRoutes from "./templateRoutes";

const router = express.Router();
const base = `/api/v1`;

router.get("/", (req: Request, res: Response) => {
  res.send("Fibe authentication service API");
});

router.use(`${base}/notification`, deliveryRoutes);
router.use(`${base}/notification`, templateRoutes);

// Prometheus middleware Metrics endpoint
router.get("/metrics", metricsEndpoint);

// Handle unknown routes Catch-all route for undefined routes
router.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find (${req.method}) ${req.originalUrl} on this server. Please check the documentation for the correct route.`,
  });
});

export default router;
