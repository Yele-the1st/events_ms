import { Schema, model, Document } from "mongoose";

export interface Template extends Document {
  name: string;
  subject: string;
  body: string;
  channel: "email" | "sms"; // Specify the channels you're supporting
  createdByType: "user" | "system"; // Specifies if the notification was created by a user or system
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<Template>(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    channel: { type: String, enum: ["email", "sms"], required: true },
    createdByType: {
      type: String,
      enum: ["user", "system"],
      required: true,
    }, // Specifies whether created by a user or system
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const TemplateModel = model<Template>("Template", TemplateSchema);
