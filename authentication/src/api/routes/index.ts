import express, { Request, Response } from "express";
import { metricsEndpoint } from "../../config/prometheus/metrics";
import authRoutes from "./authRoutes";

const router = express.Router();
const base = `/api/v1`;

router.get("/", (req: Request, res: Response) => {
  res.send("Fibe authentication API");
});

router.use(`${base}/auth`, authRoutes);

// Prometheus middleware
// Metrics endpoint
router.get("/metrics", metricsEndpoint);

// Catch-all route for undefined routes
router.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find (${req.method}) ${req.originalUrl} on this server. Please check the documentation for the correct route.`,
  });
});

export default router;
