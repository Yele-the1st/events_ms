import express, { Router } from "express";
import { authController } from "../controllers/authController";

const router: Router = express.Router();

router.get("/login", authController.login);

export default router;
