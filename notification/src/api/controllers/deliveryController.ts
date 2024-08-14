import { Request, Response, NextFunction } from "express";
import EmailDeliveryService from "../../services/delivery/emailDeliveryService";

class DeliveryController {
  private emailDeliveryService: EmailDeliveryService;

  constructor() {
    this.emailDeliveryService = new EmailDeliveryService();
  }

  /**
   * Sends a welcome email to new users.
   */
  async sendWelcomeEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { recipients, createdBy } = req.body;
      const notification = await this.emailDeliveryService.sendWelcomeEmail(
        recipients,
        createdBy
      );
      res.status(200).json(notification);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sends a newsletter email to users.
   */
  async sendNewsletterEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { recipients, content } = req.body;
      const notification = await this.emailDeliveryService.sendNewsletterEmail(
        recipients,
        content
      );
      res.status(200).json(notification);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sends an account deactivation email.
   */
  async sendAccountDeactivationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { recipients } = req.body;
      const notification =
        await this.emailDeliveryService.sendAccountDeactivationEmail(
          recipients
        );
      res.status(200).json(notification);
    } catch (error) {
      next(error);
    }
  }

  // Add more handlers for other types of emails such as event invitations, refunds, etc.
}

export default new DeliveryController();
