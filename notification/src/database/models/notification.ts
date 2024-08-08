import mongoose, { Document, Schema } from "mongoose";

interface INotification extends Document {
  type: "email" | "sms";
  user: mongoose.Types.ObjectId;
  template: mongoose.Types.ObjectId;
  status: "sent" | "failed";
  deliveryInfo: {
    email?: {
      messageId: string;
      status: string;
      provider: string;
    };
    sms?: {
      messageId: string;
      status: string;
      provider: string;
    };
  };
  scheduledTime?: Date;
  sentTime: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    type: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    template: { type: Schema.Types.ObjectId, ref: "Template", required: true },
    status: { type: String, enum: ["sent", "failed"], required: true },
    deliveryInfo: {
      email: {
        messageId: { type: String },
        status: { type: String },
        provider: { type: String },
      },
      sms: {
        messageId: { type: String },
        status: { type: String },
        provider: { type: String },
      },
    },
    scheduledTime: { type: Date },
    sentTime: { type: Date, required: true },
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default Notification;
