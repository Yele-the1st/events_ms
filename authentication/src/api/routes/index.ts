import express, { Request, Response } from "express";

import { metricsEndpoint } from "../../config/prometheus/metrics";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

const router = express.Router();
const base = `/api/v1`;

router.get("/", (req: Request, res: Response) => {
  res.send("Fibe authentication service API");
});

router.use(`${base}/auth`, authRoutes);
router.use(`${base}/auth`, userRoutes);

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
