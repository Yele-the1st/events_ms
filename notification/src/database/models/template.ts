import { Schema, model, Document } from "mongoose";

export interface Template extends Document {
  name: string;
  subject: string;
  body: string;
  channel: "email" | "sms"; // Specify the channels you're supporting
  createdBy: Schema.Types.ObjectId;
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
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const TemplateModel = model<Template>("Template", TemplateSchema);
