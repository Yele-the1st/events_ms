import { Schema, model, Document } from "mongoose";

export interface Notification extends Document {
  userId: Schema.Types.ObjectId;
  templateId: Schema.Types.ObjectId;
  channel: "email" | "sms"; // Specify the channels you're supporting
  status: "pending" | "sent" | "failed"; // Possible statuses
  scheduledAt: Date;
  sentAt?: Date;
  content: string;
  metadata?: Record<string, unknown>; // Use `unknown` instead of `any`
  createdBy?: Schema.Types.ObjectId; // Optional field to track who created the notification
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<Notification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    channel: { type: String, enum: ["email", "sms"], required: true },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    sentAt: { type: Date },
    content: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Optional field
  },
  { timestamps: true }
);

export const NotificationModel = model<Notification>(
  "Notification",
  NotificationSchema
);
