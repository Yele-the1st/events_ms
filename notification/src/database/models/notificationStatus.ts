import { Schema, model, Document } from "mongoose";

interface NotificationStatus extends Document {
  notificationId: Schema.Types.ObjectId;
  status: "pending" | "sent" | "failed"; // Define possible statuses
  timestamp: Date;
  details?: string;
}

const NotificationStatusSchema = new Schema<NotificationStatus>({
  notificationId: {
    type: Schema.Types.ObjectId,
    ref: "Notification",
    required: true,
  },
  status: { type: String, enum: ["pending", "sent", "failed"], required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
});

export const NotificationStatusModel = model<NotificationStatus>(
  "NotificationStatus",
  NotificationStatusSchema
);
