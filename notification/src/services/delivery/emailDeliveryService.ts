import mongoose from "mongoose";
import logger from "../../config/winston/logger";
import { Notification } from "../../database/models/notification";
import { EmailNotificationJobData, emailQueue } from "../../queues/emailQueue";
import { NotificationService } from "../notificationService";

interface SendEmailParams {
  recipients: { email: string }[];
  templateName: string;
  scheduledAt: Date;
  channel: "email";
  createdByType: "user" | "system";
  data?: Record<string, string>;
  createdBy?: mongoose.Types.ObjectId;
  sourceEmail?: string;
  replyToAddresses?: string[];
}

export class EmailDeliveryService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * Maps recipients from string `userId` to `mongoose.Types.ObjectId`.
   * @param recipients - Array of objects containing `userId` and `email` string values.
   * @returns Mapped recipients with `userId` converted to `mongoose.Types.ObjectId`.
   */
  private mapRecipients(recipients: { email: string }[]) {
    return recipients.map(({ email }) => ({
      email,
    }));
  }

  /**
   * Prepares job data for the email queue.
   * @param params - Object containing all parameters needed to prepare the job data.
   * @param params.recipients - Array of recipient objects with `userId` and `email`.
   * @param params.subject - Email template with subject and content.
   * @param params.notificationId - The ID of the notification.
   * @param params.content - The content of the email message.
   * @param [params.sourceEmail] - (Optional) Source email address.
   * @param [params.replyToAddresses] - (Optional) Array of reply-to email addresses.
   * @returns An array of job data ready for queueing.
   */
  private async prepareJobs({
    recipients,
    subject,
    notificationId,
    content,
    sourceEmail = "", // Default to empty string if not provided
    replyToAddresses = [], // Default to empty array if not provided
  }: {
    recipients: { email: string }[];
    subject: string;
    notificationId: mongoose.Types.ObjectId;
    content: string;
    sourceEmail?: string;
    replyToAddresses?: string[];
  }): Promise<Array<{ data: EmailNotificationJobData }>> {
    return recipients.map(({ email }) => ({
      data: {
        recipient: { email },
        subject,
        message: content,
        notificationId,
        type: "email", // Ensure this matches the literal type "email"
        provider: "NODEMAILER", // Ensure this matches one of the literal types in your type definition
        sourceEmail,
        replyToAddresses,
      } as EmailNotificationJobData,
    }));
  }

  /**
   * Sends an email using the specified template and schedules it in the email queue.
   *
   * @param {Object} params - The parameters for sending the email.
   * @param {Array<{userId: mongoose.Types.ObjectId; email: string}>} params.recipients - An array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.templateName - The name of the email template to use.
   * @param {Date} params.scheduledAt - The date and time when the email should be sent.
   * @param {"email"} params.channel - The communication channel, in this case, always "email".
   * @param {"user" | "system"} params.createdByType - Specifies whether the email was triggered by a "user" or the "system".
   * @param {Record<string, string>} [params.data] - Optional. Data to replace placeholders in the email template.
   * @param {mongoose.Types.ObjectId} [params.createdBy] - Optional. The ID of the user who initiated the email.
   * @param {string} [params.sourceEmail] - Optional. The source email address for sending the email.
   * @param {string[]} [params.replyToAddresses] - Optional. Array of reply-to email addresses.
   * @returns {Promise<Notification>} - Returns a promise that resolves to the created notification document.
   *
   * @throws {Error} - Throws an error if sending the email or creating the notification fails.
   *
   * @example
   * // Example usage of queueEmail:
   * const recipients = [
   *   { userId: new mongoose.Types.ObjectId("user1Id"), email: "user1@example.com" },
   *   { userId: new mongoose.Types.ObjectId("user2Id"), email: "user2@example.com" },
   * ];
   * const templateName = "welcomeEmail";
   * const scheduledAt = new Date();
   * const createdByType = "system";
   * const data = { username: "JohnDoe" };
   *
   * queueEmail({
   *   recipients,
   *   templateName,
   *   scheduledAt,
   *   channel: "email",
   *   createdByType,
   *   data,
   *   createdBy: new mongoose.Types.ObjectId("adminId"),
   *   sourceEmail: "noreply@example.com",
   *   replyToAddresses: ["support@example.com"],
   * })
   * .then(notification => {
   *   console.log("Email sent successfully:", notification);
   * })
   * .catch(error => {
   *   console.error("Error sending email:", error);
   * });
   */
  async queueEmail({
    recipients,
    templateName,
    scheduledAt,
    channel,
    createdByType,
    data,
    createdBy,
    sourceEmail,
    replyToAddresses,
  }: SendEmailParams): Promise<Notification> {
    try {
      const notification =
        await this.notificationService.createAndScheduleNotification({
          recipients,
          templateName,
          scheduledAt,
          channel,
          createdByType,
          data,
          createdBy,
        });

      const jobs = await this.prepareJobs({
        recipients,
        subject: notification.title, // Assuming this is meant to be the email subject
        notificationId: notification._id as mongoose.Types.ObjectId,
        content: notification.content,
        sourceEmail, // This will be undefined if not provided
        replyToAddresses, // This will be undefined if not provided
      });

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
   *
   * @param {Object} params - The parameters for sending the welcome email.
   * @param {Array<{ email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} [params.createdBy] - Optional. The ID of the user who initiated the email.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendWelcomeEmail({
    recipients,
    createdBy,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { email: string }[];
    createdBy?: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const createdByType = createdBy ? "user" : "system";
    const createdById = createdBy
      ? new mongoose.Types.ObjectId(createdBy)
      : undefined;

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "test2",
      channel: "email",
      scheduledAt,
      createdByType,
      createdBy: createdById,
    });
  }

  /**
   * Sends a password reset email.
   *
   * @param {Object} params - The parameters for sending the password reset email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.resetLink - Link to reset the user's password.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendPasswordResetEmail({
    recipients,
    otp,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    otp: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { otp };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "passwordResetEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends a newsletter email to multiple recipients.
   *
   * @param {Object} params - The parameters for sending the newsletter email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.newsletterContent - The content of the newsletter.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendNewsletterEmail({
    recipients,
    newsletterContent,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    newsletterContent: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { content: newsletterContent };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "newsletterEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends an account deactivation email to users.
   *
   * @param {Object} params - The parameters for sending the account deactivation email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendAccountDeactivationEmail({
    recipients,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = {}; // No specific data needed for this email

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "accountDeactivationEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends a refund processing email to users.
   *
   * @param {Object} params - The parameters for sending the refund processing email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.refundAmount - The amount being refunded.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendRefundProcessingEmail({
    recipients,
    refundAmount,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    refundAmount: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { refundAmount };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "refundProcessingEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends an event invitation email.
   *
   * @param {Object} params - The parameters for sending the event invitation email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.eventDetails - Details about the event.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendInvitationEmail({
    recipients,
    eventDetails,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    eventDetails: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { eventDetails };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "invitationEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends a promotional email to users.
   *
   * @param {Object} params - The parameters for sending the promotional email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.promotionDetails - Information about the promotion.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendPromotionalEmail({
    recipients,
    promotionDetails,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    promotionDetails: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { promotionDetails };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "promotionalEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends a feedback request email.
   *
   * @param {Object} params - The parameters for sending the feedback request email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.feedbackLink - The link to the feedback form.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendFeedbackRequestEmail({
    recipients,
    feedbackLink,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    feedbackLink: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { feedbackLink };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "feedbackRequestEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends an event cancellation email.
   *
   * @param {Object} params - The parameters for sending the event cancellation email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.eventDetails - Details of the cancelled event.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendEventCancellationEmail({
    recipients,
    eventDetails,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    eventDetails: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { eventDetails };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "eventCancellationEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends an event reminder email.
   *
   * @param {Object} params - The parameters for sending the event reminder email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.eventDetails - Details of the upcoming event.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendEventReminderEmail({
    recipients,
    eventDetails,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    eventDetails: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { eventDetails };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "eventReminderEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends a ticket purchase email.
   *
   * @param {Object} params - The parameters for sending the ticket purchase email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.ticketDetails - Details of the purchased ticket.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendTicketPurchaseEmail({
    recipients,
    ticketDetails,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    ticketDetails: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { ticketDetails };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "ticketPurchaseEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends an event update email.
   *
   * @param {Object} params - The parameters for sending the event update email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.eventUpdate - Details of the event update.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendEventUpdateEmail({
    recipients,
    eventUpdate,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    eventUpdate: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { eventUpdate };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "eventUpdateEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }

  /**
   * Sends an event creation email.
   *
   * @param {Object} params - The parameters for sending the event creation email.
   * @param {Array<{ userId: string; email: string }>} params.recipients - Array of recipient objects, each containing `userId` and `email`.
   * @param {string} params.eventDetails - Details of the created event.
   * @param {Date} [params.scheduledAt] - Optional. The date and time when the notification should be sent. Defaults to the current date and time.
   * @returns {Promise<Notification>} - A promise that resolves to the created notification document.
   */
  async sendEventCreationEmail({
    recipients,
    eventDetails,
    scheduledAt = new Date(), // Default to current date if not provided
  }: {
    recipients: { userId: string; email: string }[];
    eventDetails: string;
    scheduledAt?: Date;
  }): Promise<Notification> {
    const data = { eventDetails };

    return this.queueEmail({
      recipients: this.mapRecipients(recipients),
      templateName: "eventCreationEmail",
      channel: "email",
      data,
      scheduledAt,
      createdByType: "system",
    });
  }
}
