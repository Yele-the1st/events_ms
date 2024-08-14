import mongoose from "mongoose";
import NotificationRepository from "../database/repository/notificationRepo";
import { TemplateService } from "./templateService";
import { Notification } from "../database/models/notification";

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private templateService: TemplateService;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.templateService = new TemplateService(); // Initialize the TemplateService
  }

  /**
   * Creates and schedules a notification for multiple recipients.
   * @param {Array<{userId: mongoose.Types.ObjectId; email: string}>} recipients - Array of recipients, each containing userId and email.
   * @param {string} templateName - The name of the template to use.
   * @param {"email"} channel - The channel for the notification.
   * @param {Record<string, string>} data - The data to replace placeholders in the template.
   * @param {Date} scheduledAt - The date and time when the notification should be sent.
   * @param {"user" | "system"} createdByType - Indicates whether the notification was created by "user" or "system".
   * @param {mongoose.Types.ObjectId} [createdBy] - Optional. The ID of the user who created the notification.
   * @param {string} [sourceEmail] - The source email address for sending the email.
   * @param {string[]} [replyToAddresses] - Optional. Array of reply-to email addresses.
   * @returns {Promise<Notification>} - The created notification document.
   */
  async createAndScheduleNotification(
    recipients: { userId: mongoose.Types.ObjectId; email: string }[],
    templateName: string,
    channel: "email",
    data: Record<string, string>,
    scheduledAt: Date,
    createdByType: "user" | "system",
    createdBy?: mongoose.Types.ObjectId
  ): Promise<Notification> {
    try {
      // Fetch the template
      const template = await this.templateService.getTemplate(templateName);
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }

      // Replace placeholders in the template body with data
      const content = this.templateService.replacePlaceholders(template, data);

      // Prepare recipient details for the notification
      const recipientDetails = recipients.map(({ userId, email }) => ({
        userId,
        email,
        status: "pending" as const, // Initial status for the recipient
      }));

      // Create the notification object
      const notification = await this.notificationRepository.createNotification(
        {
          title: templateName, // Assuming templateName is used as the title
          content,
          createdByType,
          createdBy, // Optional if createdBy is provided
          templateId: template._id as mongoose.Types.ObjectId, // Use the template ID
          channel,
          status: "pending", // Default status
          scheduledAt,
          recipients: recipientDetails, // Attach recipients to the notification
        }
      );

      return notification;
    } catch (error) {
      throw new Error(`Failed to create and schedule notification: ${error}`);
    }
  }

  /**
   * Updates the status of a notification.
   * @param {mongoose.Types.ObjectId} id - The ID of the notification.
   * @param {Partial<Notification>} updateFields - The fields to update.
   * @returns {Promise<Notification | null>} - The updated notification or null if not found.
   */
  async updateNotificationStatus(
    id: mongoose.Types.ObjectId,
    updateFields: Partial<Omit<Notification, "createdAt" | "updatedAt">>
  ): Promise<Notification | null> {
    return await this.notificationRepository.updateNotification({
      id,
      updateFields,
    });
  }

  /**
   * Deletes a notification by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the notification.
   * @returns {Promise<void>}
   */
  async deleteNotification(id: mongoose.Types.ObjectId): Promise<void> {
    const deleted = await this.notificationRepository.deleteNotification(id);
    if (!deleted) {
      throw new Error(`Notification ${id} not found`);
    }
  }

  /**
   * Finds notifications by user ID.
   * @param {mongoose.Types.ObjectId} userId - The user ID.
   * @returns {Promise<Notification[]>} - The list of notifications.
   */
  async findNotificationsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<Notification[]> {
    return await this.notificationRepository.findByUserId(userId);
  }

  /**
   * Finds notifications by status.
   * @param {string} status - The status of notifications.
   * @returns {Promise<Notification[]>} - The list of notifications.
   */
  async findNotificationsByStatus(
    status: "pending" | "queued" | "processing" | "completed"
  ): Promise<Notification[]> {
    return await this.notificationRepository.findByStatus(status);
  }
}
