import { Request, Response, NextFunction } from "express";

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("logged in");
      res.status(200).json({ message: "Successfully logged in" });
    } catch (err) {
      next(err);
    }
  },
};
