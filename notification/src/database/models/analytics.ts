import { Schema, model, Document } from "mongoose";

export interface Analytics extends Document {
  notificationId: Schema.Types.ObjectId;
  deliveryTime: number;
  channel: "email" | "sms"; // Define channels
  status: "sent" | "failed"; // Define possible statuses
  createdAt: Date;
}

const AnalyticsSchema = new Schema<Analytics>({
  notificationId: {
    type: Schema.Types.ObjectId,
    ref: "Notification",
    required: true,
  },
  deliveryTime: { type: Number, required: true },
  channel: { type: String, enum: ["email", "sms"], required: true },
  status: { type: String, enum: ["sent", "failed"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const AnalyticsModel = model<Analytics>("Analytics", AnalyticsSchema);
