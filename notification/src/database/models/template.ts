import mongoose, { Document, Schema } from "mongoose";

interface ITemplate extends Document {
  name: string;
  subject: string;
  body: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ["email", "sms"], required: true },
  },
  { timestamps: true }
);

const Template = mongoose.model<ITemplate>("Template", TemplateSchema);

export default Template;
