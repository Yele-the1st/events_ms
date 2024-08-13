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
   * Creates and schedules a notification.
   * @param {string} templateName - The name of the template to use.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user to notify.
   * @param {Date} scheduledAt - The date and time when the notification should be sent.
   * @param {Record<string, string>} data - The data to replace placeholders in the template.
   * @param {'email' | 'sms'} channel - The channel for the notification.
   * @returns {Promise<Notification>} - The created notification.
   */
  async createAndScheduleNotification(
    templateName: string,
    userId: mongoose.Types.ObjectId,
    scheduledAt: Date,
    data: Record<string, string>,
    channel: "email" | "sms",
    createdBy?: mongoose.Types.ObjectId
  ): Promise<Notification> {
    const template = await this.templateService.getTemplate(templateName);

    // Replace placeholders in the template body
    const content = this.templateService.replacePlaceholders(template, data);

    // Create notification
    const notification = await this.notificationRepository.createNotification({
      userId,
      createdBy,
      templateId: template._id as mongoose.Types.ObjectId,
      channel,
      status: "pending",
      scheduledAt,
      content,
      metadata: data,
    });

    return notification;
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
    status: "pending" | "sent" | "failed"
  ): Promise<Notification[]> {
    return await this.notificationRepository.findByStatus(status);
  }
}
