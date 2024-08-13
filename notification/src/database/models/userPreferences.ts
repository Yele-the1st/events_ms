import { Schema, model, Document } from "mongoose";

export interface UserPreferences extends Document {
  userId: Schema.Types.ObjectId;
  notificationsEnabled: boolean;
  preferredChannels: Array<"email" | "sms">; // Array of specific channels
  frequency: "immediate" | "daily" | "weekly";
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<UserPreferences>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  notificationsEnabled: { type: Boolean, default: true },
  preferredChannels: { type: [String], enum: ["email", "sms"], required: true },
  frequency: {
    type: String,
    enum: ["immediate", "daily", "weekly"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserPreferencesModel = model<UserPreferences>(
  "UserPreferences",
  UserPreferencesSchema
);
