import { Schema, model, Document } from "mongoose";

// Interface for recipient information
interface Recipient {
  email: string;
  status: "pending" | "sent" | "failed"; // Status of the notification for each recipient
  sentAt?: Date; // Optional, when the notification was sent
}

// Notification interface extending Document for MongoDB
export interface Notification extends Document {
  title: string;
  content: string;
  createdByType: "user" | "system"; // Specifies if the notification was created by a user or system
  createdBy?: Schema.Types.ObjectId; // Optional field, reference to the user if `createdByType` is "user"
  recipients: Recipient[]; // Array of recipient objects
  templateId?: Schema.Types.ObjectId; // Optional template reference
  channel: "email" | "sms"; // Supported channels
  status: "pending" | "queued" | "processing" | "completed"; // Overall status of the notification
  scheduledAt: Date; // When the notification is scheduled to be sent
  createdAt: Date;
  updatedAt: Date;
}

// Define the Recipient schema
const RecipientSchema = new Schema<Recipient>({
  email: { type: String, required: true }, // Only the email is required
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    required: true,
  },
  sentAt: { type: Date }, // Optional, when the notification was sent
});

// Define the Notification schema
const NotificationSchema = new Schema<Notification>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdByType: {
      type: String,
      enum: ["user", "system"],
      required: true,
    }, // Specifies whether created by a user or system
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, // Optional field, only required if createdByType is "user"
    recipients: [RecipientSchema], // Array of recipients (just emails now)
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "Template",
    }, // Optional template reference
    channel: {
      type: String,
      enum: ["email", "sms"],
      required: true,
    }, // Specifies the communication channel
    status: {
      type: String,
      enum: ["pending", "queued", "processing", "completed"],
      required: true,
    }, // Overall status of the notification
    scheduledAt: {
      type: Date,
      required: true,
    }, // When the notification is scheduled to be sent
  },
  { timestamps: true }
);

// Export the Notification model
export const NotificationModel = model<Notification>(
  "Notification",
  NotificationSchema
);
