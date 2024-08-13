import { Schema, model, Document } from "mongoose";

export interface UserSubscription extends Document {
  userId: Schema.Types.ObjectId;
  channel: "email" | "sms";
  preferences: Record<string, unknown>;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSubscriptionSchema = new Schema<UserSubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  channel: { type: String, enum: ["email", "sms"], required: true },
  preferences: { type: Schema.Types.Mixed, required: true },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserSubscriptionModel = model<UserSubscription>(
  "UserSubscription",
  UserSubscriptionSchema
);
