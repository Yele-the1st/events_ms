import mongoose from "mongoose";
import NotificationRepository from "../../database/repository/notificationRepo";
import { TemplateService } from "../templateService";
import logger from "../../config/winston/logger";
import { Notification } from "../../database/models/notification";

class EmailDeliveryService {
  private notificationRepository: NotificationRepository;
  private templateService: TemplateService;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.templateService = new TemplateService(); // Initialize the TemplateService
  }

  private async sendEmail(
    userId: mongoose.Types.ObjectId,
    templateName: string,
    channel: "email",
    data: Record<string, string>,
    scheduledAt: Date,
    createdBy?: mongoose.Types.ObjectId
  ): Promise<Notification> {
    try {
      const template = await this.templateService.getTemplate(templateName);
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }

      // Replace placeholders in the template body
      const content = this.templateService.replacePlaceholders(template, data);

      // Create notification
      const notification = await this.notificationRepository.createNotification(
        {
          userId,
          templateId: template._id as mongoose.Types.ObjectId,
          channel,
          status: "pending",
          scheduledAt,
          content,
          metadata: data,
          createdBy, // Set the creator of the notification
        }
      );

      return notification;
    } catch (error) {
      logger.error(
        `Failed to send email for template ${templateName}. Error: ${error}`,
        { error, userId, templateName, channel, data, scheduledAt, createdBy }
      );
      throw error; // Rethrow the error to handle it further up the chain
    }
  }

  async sendWelcomeEmail(
    userId: string,
    email: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "welcomeEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendOTPEmail(
    userId: string,
    email: string,
    otp: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, otp };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "otpEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendPasswordResetEmail(
    userId: string,
    email: string,
    resetToken: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, resetToken };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "passwordResetEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendEventCreationEmail(
    userId: string,
    email: string,
    eventId: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, eventId };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "eventCreationEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendEventUpdateEmail(
    userId: string,
    email: string,
    eventId: string,
    changes: string[],
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, eventId, changes: changes.join(", ") };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "eventUpdateEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendTicketPurchaseEmail(
    userId: string,
    email: string,
    ticketId: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, ticketId };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "ticketPurchaseEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendEventReminderEmail(
    userId: string,
    email: string,
    eventId: string,
    reminderTime: Date,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, eventId, reminderTime: reminderTime.toISOString() };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "eventReminderEmail",
      "email",
      data,
      reminderTime,
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendEventCancellationEmail(
    userId: string,
    email: string,
    eventId: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, eventId };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "eventCancellationEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendFeedbackRequestEmail(
    userId: string,
    email: string,
    eventId: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, eventId };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "feedbackRequestEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendPromotionalEmail(
    userId: string,
    email: string,
    promotionDetails: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, promotionDetails };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "promotionalEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendInvitationEmail(
    userId: string,
    email: string,
    eventId: string,
    invitationMessage: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, eventId, invitationMessage };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "invitationEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendRefundProcessingEmail(
    userId: string,
    email: string,
    refundId: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, refundId };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "refundProcessingEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendAccountDeactivationEmail(
    userId: string,
    email: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "accountDeactivationEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  async sendNewsletterEmail(
    userId: string,
    email: string,
    newsletterContent: string,
    createdBy?: string
  ): Promise<Notification> {
    const data = { email, newsletterContent };
    return this.sendEmail(
      new mongoose.Types.ObjectId(userId),
      "newsletterEmail",
      "email",
      data,
      new Date(),
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }
}

export default EmailDeliveryService;
