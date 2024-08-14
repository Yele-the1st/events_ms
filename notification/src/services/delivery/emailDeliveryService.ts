import mongoose from "mongoose";
import logger from "../../config/winston/logger";
import { Notification } from "../../database/models/notification";
import { EmailNotificationJobData, emailQueue } from "../../queues/emailQueue";
import { NotificationService } from "../notificationService";

class EmailDeliveryService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * Maps recipients from string `userId` to `mongoose.Types.ObjectId`.
   * @param recipients - Array of objects containing `userId` and `email` string values.
   * @returns Mapped recipients with `userId` converted to `mongoose.Types.ObjectId`.
   */
  private mapRecipients(recipients: { userId: string; email: string }[]) {
    return recipients.map(({ userId, email }) => ({
      userId: new mongoose.Types.ObjectId(userId),
      email,
    }));
  }

  /**
   * Prepares job data for the email queue.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param subject - Email template with subject and content.
   * @param notificationId - The ID of the notification.
   * @param content - The content of the email message.
   * @param sourceEmail - (Optional) Source email address.
   * @param replyToAddresses - (Optional) Array of reply-to email addresses.
   * @returns An array of job data ready for queueing.
   */
  private async prepareJobs(
    recipients: { userId: mongoose.Types.ObjectId; email: string }[],
    subject: string,
    notificationId: mongoose.Types.ObjectId,
    content: string,
    sourceEmail?: string,
    replyToAddresses?: string[]
  ): Promise<Array<{ data: EmailNotificationJobData }>> {
    return recipients.map(({ userId, email }) => ({
      data: {
        recipient: { email },
        subject,
        message: content,
        notificationId,
        userId: userId.toString(),
        type: "email", // Ensure this matches the literal type "email"
        provider: "NODEMAILER", // Ensure this matches one of the literal types in your type definition
        sourceEmail: sourceEmail ?? "", // Provide a default empty string if undefined
        replyToAddresses: replyToAddresses ?? [], // Provide a default empty array if undefined
      } as EmailNotificationJobData,
    }));
  }

  /**
   * Sends an email using a specified template.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param templateName - The name of the email template to be used.
   * @param channel - The communication channel (in this case, "email").
   * @param data - Data used to replace placeholders in the email template.
   * @param scheduledAt - The date and time when the email should be sent.
   * @param createdByType - Indicates whether the notification was created by "user" or "system".
   * @param createdBy - (Optional) The ID of the user who created the notification.
   * @param sourceEmail - (Optional) The source email address for sending the email.
   * @param replyToAddresses - (Optional) Array of reply-to email addresses.
   * @returns A promise that resolves to the created notification document.
   */
  private async sendEmail(
    recipients: { userId: mongoose.Types.ObjectId; email: string }[],
    templateName: string,
    channel: "email",
    data: Record<string, string>,
    scheduledAt: Date,
    createdByType: "user" | "system",
    createdBy?: mongoose.Types.ObjectId,
    sourceEmail?: string,
    replyToAddresses?: string[]
  ): Promise<Notification> {
    try {
      // Create and schedule the notification using the refactored method
      const notification =
        await this.notificationService.createAndScheduleNotification(
          recipients,
          templateName,
          channel,
          data,
          scheduledAt,
          createdByType,
          createdBy
        );

      // Prepare email jobs for the queue
      const jobs: Array<{ data: EmailNotificationJobData }> =
        await this.prepareJobs(
          recipients,
          notification.content, // Use the content from the notification
          notification._id as mongoose.Types.ObjectId, // Use the ID from the newly created notification
          notification.content, // Use the content
          sourceEmail,
          replyToAddresses
        );

      // Add jobs to the email queue
      await emailQueue.addJobsBulk(jobs);

      return notification;
    } catch (error) {
      logger.error(
        `Failed to send email for template ${templateName}. Error: ${error}`,
        {
          error,
          recipients,
          templateName,
          channel,
          data,
          scheduledAt,
          createdByType,
          createdBy,
        }
      );
      throw error;
    }
  }

  /**
   * Sends a welcome email to new users.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param createdBy - (Optional) The ID of the user who initiated the email.
   * @returns A promise that resolves to the created notification document.
   */
  async sendWelcomeEmail(
    recipients: { userId: string; email: string }[],
    createdBy?: string
  ): Promise<Notification> {
    const data = { email: recipients.map((r) => r.email).join(", ") };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "welcomeEmail",
      "email",
      data,
      new Date(),
      createdBy ? "user" : "system",
      createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined
    );
  }

  /**
   * Sends a newsletter email to multiple recipients.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param newsletterContent - The content of the newsletter.
   * @returns A promise that resolves to the created notification document.
   */
  async sendNewsletterEmail(
    recipients: { userId: string; email: string }[],
    newsletterContent: string
  ): Promise<Notification> {
    const data = { content: newsletterContent };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "newsletterEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends an account deactivation email to users.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @returns A promise that resolves to the created notification document.
   */
  async sendAccountDeactivationEmail(
    recipients: { userId: string; email: string }[]
  ): Promise<Notification> {
    const data = {};
    return this.sendEmail(
      this.mapRecipients(recipients),
      "accountDeactivationEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends a refund processing email to users.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param refundAmount - The amount being refunded.
   * @returns A promise that resolves to the created notification document.
   */
  async sendRefundProcessingEmail(
    recipients: { userId: string; email: string }[],
    refundAmount: string
  ): Promise<Notification> {
    const data = { refundAmount };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "refundProcessingEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends an event invitation email.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param eventDetails - Details about the event.
   * @returns A promise that resolves to the created notification document.
   */
  async sendInvitationEmail(
    recipients: { userId: string; email: string }[],
    eventDetails: string
  ): Promise<Notification> {
    const data = { eventDetails };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "invitationEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends a promotional email to users.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param promotionDetails - Information about the promotion.
   * @returns A promise that resolves to the created notification document.
   */
  async sendPromotionalEmail(
    recipients: { userId: string; email: string }[],
    promotionDetails: string
  ): Promise<Notification> {
    const data = { promotionDetails };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "promotionalEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends a feedback request email.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param feedbackLink - The link to the feedback form.
   * @returns A promise that resolves to the created notification document.
   */
  async sendFeedbackRequestEmail(
    recipients: { userId: string; email: string }[],
    feedbackLink: string
  ): Promise<Notification> {
    const data = { feedbackLink };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "feedbackRequestEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends an event cancellation email.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param eventDetails - Details of the cancelled event.
   * @returns A promise that resolves to the created notification document.
   */
  async sendEventCancellationEmail(
    recipients: { userId: string; email: string }[],
    eventDetails: string
  ): Promise<Notification> {
    const data = { eventDetails };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "eventCancellationEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends an event reminder email.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param eventDetails - Details of the upcoming event.
   * @returns A promise that resolves to the created notification document.
   */
  async sendEventReminderEmail(
    recipients: { userId: string; email: string }[],
    eventDetails: string
  ): Promise<Notification> {
    const data = { eventDetails };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "eventReminderEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends a ticket purchase email.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param ticketDetails - Details of the purchased ticket.
   * @returns A promise that resolves to the created notification document.
   */
  async sendTicketPurchaseEmail(
    recipients: { userId: string; email: string }[],
    ticketDetails: string
  ): Promise<Notification> {
    const data = { ticketDetails };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "ticketPurchaseEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends an event update email.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param eventUpdate - Details of the event update.
   * @returns A promise that resolves to the created notification document.
   */
  async sendEventUpdateEmail(
    recipients: { userId: string; email: string }[],
    eventUpdate: string
  ): Promise<Notification> {
    const data = { eventUpdate };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "eventUpdateEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends an event creation email.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param eventDetails - Details of the created event.
   * @returns A promise that resolves to the created notification document.
   */
  async sendEventCreationEmail(
    recipients: { userId: string; email: string }[],
    eventDetails: string
  ): Promise<Notification> {
    const data = { eventDetails };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "eventCreationEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }

  /**
   * Sends a password reset email.
   * @param recipients - Array of recipient objects with `userId` and `email`.
   * @param resetLink - Link to reset the user's password.
   * @returns A promise that resolves to the created notification document.
   */
  async sendPasswordResetEmail(
    recipients: { userId: string; email: string }[],
    resetLink: string
  ): Promise<Notification> {
    const data = { resetLink };
    return this.sendEmail(
      this.mapRecipients(recipients),
      "passwordResetEmail",
      "email",
      data,
      new Date(),
      "system"
    );
  }
}

export default EmailDeliveryService;
