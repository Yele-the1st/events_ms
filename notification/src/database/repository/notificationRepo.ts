import mongoose from "mongoose";
import { Notification, NotificationModel } from "../models/notification";

interface CreateNotificationParams {
  userId: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId;
  channel: "email" | "sms";
  status: "pending" | "sent" | "failed";
  scheduledAt: Date;
  sentAt?: Date;
  content: string;
  metadata?: Record<string, unknown>;
}

interface UpdateNotificationParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<Omit<Notification, "createdAt" | "updatedAt">>;
}

class NotificationRepository {
  /**
   * Creates a new notification.
   * @param {CreateNotificationParams} params - Object containing notification details.
   * @returns {Promise<Notification>} - The created notification.
   */
  async createNotification(
    params: CreateNotificationParams
  ): Promise<Notification> {
    const notification = new NotificationModel(params);
    return await notification.save();
  }

  /**
   * Finds a notification by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the notification.
   * @returns {Promise<Notification | null>} - The found notification or null if not found.
   */
  async findById(id: mongoose.Types.ObjectId): Promise<Notification | null> {
    return await NotificationModel.findById(id).exec();
  }

  /**
   * Finds notifications by user ID.
   * @param {mongoose.Types.ObjectId} userId - The user ID associated with notifications.
   * @returns {Promise<Notification[]>} - The list of found notifications.
   */
  async findByUserId(userId: mongoose.Types.ObjectId): Promise<Notification[]> {
    return await NotificationModel.find({ userId }).exec();
  }

  /**
   * Finds notifications by status.
   * @param {string} status - The status of notifications to find.
   * @returns {Promise<Notification[]>} - The list of found notifications.
   */
  async findByStatus(
    status: "pending" | "sent" | "failed"
  ): Promise<Notification[]> {
    return await NotificationModel.find({ status }).exec();
  }

  /**
   * Updates a notification by ID.
   * @param {UpdateNotificationParams} params - Object containing ID and update fields.
   * @returns {Promise<Notification | null>} - The updated notification or null if not found.
   */
  async updateNotification(
    params: UpdateNotificationParams
  ): Promise<Notification | null> {
    const { id, updateFields } = params;
    return await NotificationModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  /**
   * Deletes a notification by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the notification.
   * @returns {Promise<boolean>} - True if the notification was deleted, false otherwise.
   */
  async deleteNotification(id: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await NotificationModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}

export default NotificationRepository;
