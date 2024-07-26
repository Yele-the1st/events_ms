import { Schema, model, Document, Model } from "mongoose";

interface ISecurityLog extends Document {
  userId: Schema.Types.ObjectId;
  action: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  createdAt: Date;
}

const securityLogSchema: Schema<ISecurityLog> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

const SecurityLog: Model<ISecurityLog> = model(
  "SecurityLog",
  securityLogSchema
);

export { SecurityLog, ISecurityLog };
