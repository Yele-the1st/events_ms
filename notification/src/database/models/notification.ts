import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  type: string;
  recipient: string;
  subject: string;
  message: string;
  status: string;
  scheduledTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    type: { type: String, required: true },
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
    scheduledTime: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
