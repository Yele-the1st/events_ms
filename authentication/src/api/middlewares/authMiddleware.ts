import { Request, Response, NextFunction } from "express";
import logger from "../../config/winston/logger";

const checkAPIKey = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const permit = req.header("X-API-KEY");
    if (!permit || permit !== process.env.API_KEY) {
      res
        .status(403)
        .send(
          "<h1>Forbidden</h1><p>You don't have permission to access this resource.</p>"
        );
      return;
    }
    next();
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: "FAILED",
      error: "Internal Server Error",
    });
  }
};

export default checkAPIKey;
