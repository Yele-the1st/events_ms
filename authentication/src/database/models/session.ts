import { Schema, model, Document } from "mongoose";

interface ISession extends Document {
  userId: Schema.Types.ObjectId;
  refreshToken: string;
  userAgent: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    refreshToken: { type: String, required: true },
    userAgent: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Session = model<ISession>("Session", sessionSchema);

export { Session, ISession };
