import { Router } from "express";
import deliveryController from "../controllers/deliveryController";

const router = Router();

router.post("/send-welcome-email", deliveryController.sendWelcomeEmail);
router.post("/send-newsletter-email", deliveryController.sendNewsletterEmail);
router.post(
  "/send-account-deactivation-email",
  deliveryController.sendAccountDeactivationEmail
);

// Add other routes for different email types as needed.

export default router;
