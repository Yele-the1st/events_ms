import mongoose from "mongoose";
import { Notification, NotificationModel } from "../models/notification";

export interface CreateNotificationParams {
  title: string;
  content: string;
  createdByType: "user" | "system"; // Specifies whether created by a user or system
  createdBy?: mongoose.Types.ObjectId; // Optional field, only required if createdByType is "user"
  templateId?: mongoose.Types.ObjectId; // Optional template reference
  channel: "email" | "sms"; // Supported channels
  status: "pending" | "queued" | "processing" | "completed"; // Overall notification status
  scheduledAt: Date; // When the notification is scheduled to be sent
  recipients: {
    userId: mongoose.Types.ObjectId;
    email: string;
    status: "pending" | "sent" | "failed";
    sentAt?: Date;
  }[]; // Array of recipients
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
    return await NotificationModel.find({ "recipients.userId": userId }).exec();
  }

  /**
   * Finds notifications by status.
   * @param {string} status - The status of notifications to find.
   * @returns {Promise<Notification[]>} - The list of found notifications.
   */
  async findByStatus(
    status: "pending" | "queued" | "processing" | "completed"
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
