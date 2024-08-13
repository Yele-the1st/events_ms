import { Schema, model, Document } from "mongoose";

export interface AuditLog extends Document {
  action: string;
  performedBy: Schema.Types.ObjectId;
  details: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<AuditLog>({
  action: { type: String, required: true },
  performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  details: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export const AuditLogModel = model<AuditLog>("AuditLog", AuditLogSchema);
