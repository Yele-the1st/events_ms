import { Request, Response, NextFunction } from "express";
import { EmailDeliveryService } from "../../services/delivery/emailDeliveryService";

export class DeliveryController {
  private emailDeliveryService: EmailDeliveryService;

  constructor() {
    this.emailDeliveryService = new EmailDeliveryService();
  }

  /**
   * Sends a welcome email to new users.
   */
  sendWelcomeEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { recipients, firstName, lastName, company } = req.body;
      const data = { firstName, lastName, company };
      const notification = await this.emailDeliveryService.sendWelcomeEmail({
        recipients,
        data,
      });
      res.status(200).json(notification);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Sends a newsletter email to users.
   */
  sendNewsletterEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { recipients, content, scheduledAt } = req.body;
      const notification = await this.emailDeliveryService.sendNewsletterEmail({
        recipients,
        newsletterContent: content,
        scheduledAt,
      });
      res.status(200).json(notification);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Sends an account deactivation email.
   */
  sendAccountDeactivationEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { recipients, scheduledAt } = req.body;
      const notification =
        await this.emailDeliveryService.sendAccountDeactivationEmail({
          recipients,
          scheduledAt,
        });
      res.status(200).json(notification);
    } catch (error) {
      next(error);
    }
  };

  // Add more handlers for other types of emails such as event invitations, refunds, etc.
}
