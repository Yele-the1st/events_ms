import mongoose from "mongoose";
import NotificationRepository from "../database/repository/notificationRepo";
import { TemplateService } from "./templateService";
import { Notification } from "../database/models/notification";

interface CreateNotificationServiceParams {
  recipients: { email: string }[]; // Collect only the email for each recipient
  templateName: string;
  scheduledAt: Date;
  channel: "email";
  createdByType: "user" | "system";
  data?: Record<string, string>;
  createdBy?: mongoose.Types.ObjectId;
  sourceEmail?: string;
  replyToAddresses?: string[];
}

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private templateService: TemplateService;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.templateService = new TemplateService(); // Initialize the TemplateService
  }

  async createAndScheduleNotification({
    recipients,
    templateName,
    scheduledAt,
    channel,
    createdByType,
    data,
    createdBy,
  }: CreateNotificationServiceParams): Promise<Notification> {
    try {
      // Fetch the template
      const template = await this.templateService.getTemplate(templateName);
      if (!template) {
        throw new Error(`Template "${templateName}" not found`);
      }

      // Replace placeholders in the template body with data, if provided
      const content = data
        ? this.templateService.replacePlaceholders(template.body, data)
        : template.body;

      // Replace placeholders in the template subject with data, if provided
      const subject = data
        ? this.templateService.replacePlaceholders(template.subject, data)
        : template.subject;

      // Prepare recipient details for the notification
      const recipientDetails = recipients.map(({ email }) => ({
        email,
        status: "pending" as const, // Initial status for the recipient
      }));

      // Create the notification object
      const notification = await this.notificationRepository.createNotification(
        {
          title: subject, // Assuming templateName is used as the title
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
  async findNotificationsByUserId(email: string): Promise<Notification[]> {
    return await this.notificationRepository.findByEmail(email);
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
